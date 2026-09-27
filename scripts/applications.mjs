#!/usr/bin/env node
/**
 * 応募の台帳（Supabase `applications`）を読み書きする。管理ページ /admin と同じデータ。
 * AI のセッションや手元の作業から使う。service_role キーを使うので、実行は手元だけ。
 *
 *   op run --env-file=.env.op -- node scripts/applications.mjs <command> [...]
 *
 *   list [--kind listing|radio] [--stage active|all|<stage>]
 *   show <id|バンド名>
 *   add --band <名前> [--kind listing|radio] [--purpose ..] [--contact ..] [--contact-name ..]
 *       [--stage ..] [--next ..] [--publish YYYY-MM-DD] [--url ..] [--memo ..] [--date YYYY-MM-DD]
 *   update <id|バンド名> [--stage ..] [--selection pending|selected|not_selected|none] [--next ..]
 *       [--publish YYYY-MM-DD|none] [--url ..] [--memo ..] [--memo-append ..]
 *
 * stage: received replied scheduling interviewed drafting review ready published on_hold declined
 */
import { createClient } from "@supabase/supabase-js";

const STAGES = {
  received: "受付", replied: "返信済", scheduling: "取材調整中", interviewed: "取材実施",
  drafting: "ドラフト中", review: "本人確認待ち", ready: "公開準備", published: "公開済",
  on_hold: "保留", declined: "辞退",
};
const ACTIVE = ["received", "replied", "scheduling", "interviewed", "drafting", "review", "ready"];
const SELECTIONS = ["pending", "selected", "not_selected"];

const [cmd, ...rest] = process.argv.slice(2);
const positional = [];
const opts = {};
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) opts[rest[i].slice(2)] = rest[++i];
  else positional.push(rest[i]);
}

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  fail("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY がありません。op run --env-file=.env.op -- で実行してください");
}
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const date = (v) => {
  if (v === undefined) return undefined;
  if (v === "none") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) fail(`日付は YYYY-MM-DD で: ${v}`);
  return v;
};
const stage = (v) => {
  if (v === undefined) return undefined;
  if (!(v in STAGES)) fail(`stage は ${Object.keys(STAGES).join(" / ")} のどれか: ${v}`);
  return v;
};
const line = (r) =>
  [
    r.id.slice(0, 8),
    new Date(r.created_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }),
    STAGES[r.stage].padEnd(6, "　"),
    r.kind === "radio" ? "ラジオ" : "掲載",
    r.band_name,
    r.radio_selection ? `[選考:${r.radio_selection}]` : "",
    r.publish_date ? `${r.stage === "published" ? "公開" : "公開予定"} ${r.publish_date}` : "",
    r.next_action ? `→ ${r.next_action.replace(/\s+/g, " ").slice(0, 60)}` : "",
  ]
    .filter(Boolean)
    .join("  ");

async function find(key) {
  if (!key) fail("id かバンド名を指定してください");
  const isId = /^[0-9a-f]{8}(-[0-9a-f-]+)?$/.test(key);
  const q = db.from("applications").select("*").order("created_at", { ascending: false });
  const { data, error } = isId
    ? await q.or(`id.eq.${key.length === 36 ? key : "00000000-0000-0000-0000-000000000000"}`)
    : await q.ilike("band_name", `%${key}%`);
  if (error) fail(error.message);
  let rows = data;
  if (isId && key.length < 36) {
    const all = await db.from("applications").select("*");
    rows = (all.data ?? []).filter((r) => r.id.startsWith(key));
  }
  if (rows.length === 0) fail(`見つかりません: ${key}`);
  if (rows.length > 1) {
    const active = rows.filter((r) => ACTIVE.includes(r.stage) || r.stage === "on_hold");
    if (active.length === 1) return active[0];
    console.error(`複数あります。id で指定してください:\n${rows.map(line).join("\n")}`);
    process.exit(1);
  }
  return rows[0];
}

if (cmd === "list") {
  let q = db.from("applications").select("*").order("created_at", { ascending: false });
  if (opts.kind) q = q.eq("kind", opts.kind);
  const s = opts.stage ?? "active";
  if (s === "active") q = q.in("stage", [...ACTIVE, "on_hold"]);
  else if (s !== "all") q = q.eq("stage", stage(s));
  const { data, error } = await q;
  if (error) fail(error.message);
  console.log(data.length ? data.map(line).join("\n") : "（該当なし）");
} else if (cmd === "show") {
  const r = await find(positional[0]);
  console.log(JSON.stringify(r, null, 2));
} else if (cmd === "add") {
  if (!opts.band) fail("--band が必要です");
  const row = {
    kind: opts.kind ?? "listing",
    band_name: opts.band,
    purpose: opts.purpose ?? null,
    contact: opts.contact ?? null,
    contact_name: opts["contact-name"] ?? null,
    stage: stage(opts.stage) ?? "received",
    next_action: opts.next ?? null,
    publish_date: date(opts.publish) ?? null,
    article_url: opts.url ?? null,
    memo: opts.memo ?? null,
    source: "import",
    ...(opts.date ? { created_at: `${date(opts.date)}T00:00:00+09:00` } : {}),
  };
  const { data, error } = await db.from("applications").insert(row).select("*").single();
  if (error) fail(error.message);
  console.log(`追加しました\n${line(data)}`);
} else if (cmd === "update") {
  const r = await find(positional[0]);
  const patch = {};
  if (opts.stage !== undefined) patch.stage = stage(opts.stage);
  if (opts.selection !== undefined) {
    if (opts.selection !== "none" && !SELECTIONS.includes(opts.selection)) fail(`selection は ${SELECTIONS.join(" / ")} / none`);
    patch.radio_selection = opts.selection === "none" ? null : opts.selection;
  }
  if (opts.next !== undefined) patch.next_action = opts.next || null;
  if (opts.publish !== undefined) patch.publish_date = date(opts.publish);
  if (opts.url !== undefined) patch.article_url = opts.url || null;
  if (opts.memo !== undefined) patch.memo = opts.memo || null;
  if (opts["memo-append"] !== undefined) {
    const stamp = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
    patch.memo = [r.memo, `${stamp} ${opts["memo-append"]}`].filter(Boolean).join("\n");
  }
  if (Object.keys(patch).length === 0) fail("変更する項目を指定してください");
  const { data, error } = await db.from("applications").update(patch).eq("id", r.id).select("*").single();
  if (error) fail(error.message);
  console.log(`更新しました\n${line(data)}`);
} else {
  console.log(
    "使い方: list | show <id|名前> | add --band .. | update <id|名前> --stage ..\n詳細は scripts/applications.mjs の冒頭"
  );
}
