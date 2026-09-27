import Link from "next/link";
import { createSessionClient } from "@/lib/supabase/server";
import {
  KIND_LABELS,
  SELECTION_LABELS,
  STAGE_LABELS,
  formatDate,
  isKind,
  isStage,
  type Application,
} from "@/lib/admin";
import { AdminHeader } from "./admin-header";

const ACTIVE_STAGES = ["received", "replied", "scheduling", "interviewed", "drafting", "review", "ready"] as const;

type Search = { kind?: string; stage?: string };

export default async function AdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const kind = isKind(params.kind) ? params.kind : undefined;
  const stage = params.stage === "all" ? "all" : isStage(params.stage) ? params.stage : "active";

  const supabase = await createSessionClient();
  let query = supabase
    .from("applications")
    .select("id, created_at, kind, band_name, purpose, stage, radio_selection, next_action, publish_date")
    .order("created_at", { ascending: false })
    .limit(500);
  if (kind) query = query.eq("kind", kind);
  if (stage === "active") query = query.in("stage", ACTIVE_STAGES);
  else if (stage !== "all") query = query.eq("stage", stage);

  const { data, error } = await query;
  const rows = (data ?? []) as Pick<
    Application,
    "id" | "created_at" | "kind" | "band_name" | "purpose" | "stage" | "radio_selection" | "next_action" | "publish_date"
  >[];

  const href = (next: Search) => {
    const q = new URLSearchParams();
    const k = "kind" in next ? next.kind : kind;
    const s = "stage" in next ? next.stage : stage;
    if (k) q.set("kind", k);
    if (s && s !== "active") q.set("stage", s);
    const qs = q.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-xl font-normal">応募一覧</h1>

        <div className="mt-6 space-y-3 text-sm">
          <FilterRow label="種別">
            <Chip href={href({ kind: undefined })} active={!kind}>すべて</Chip>
            {Object.entries(KIND_LABELS).map(([k, label]) => (
              <Chip key={k} href={href({ kind: k })} active={kind === k}>{label}</Chip>
            ))}
          </FilterRow>
          <FilterRow label="段階">
            <Chip href={href({ stage: "active" })} active={stage === "active"}>進行中</Chip>
            {Object.entries(STAGE_LABELS).map(([s, label]) => (
              <Chip key={s} href={href({ stage: s })} active={stage === s}>{label}</Chip>
            ))}
            <Chip href={href({ stage: "all" })} active={stage === "all"}>すべて</Chip>
          </FilterRow>
        </div>

        {error ? (
          <p className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            読み込めませんでした（{error.message}）
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-8 border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            この条件の応募はありません
          </p>
        ) : (
          <>
            <p className="mt-6 text-xs text-neutral-500">{rows.length}件</p>
            <ul className="mt-2 divide-y divide-neutral-200 border border-neutral-200 bg-white">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/${r.id}`}
                    className="grid gap-1 px-4 py-4 transition-colors hover:bg-neutral-50 sm:grid-cols-[7rem_1fr_9rem_1fr] sm:items-center sm:gap-4"
                  >
                    <span className="text-xs text-neutral-500">{formatDate(r.created_at).slice(0, 10)}</span>
                    <span className="flex flex-col">
                      <span className="text-base text-neutral-900">{r.band_name}</span>
                      <span className="text-xs text-neutral-500">
                        {KIND_LABELS[r.kind]}
                        {r.purpose ? `・${r.purpose}` : ""}
                      </span>
                    </span>
                    <span className="flex flex-wrap gap-1">
                      <Badge>{STAGE_LABELS[r.stage]}</Badge>
                      {r.radio_selection && <Badge tone="dark">{SELECTION_LABELS[r.radio_selection]}</Badge>}
                    </span>
                    <span className="truncate text-xs text-neutral-600">
                      {r.publish_date ? `公開予定 ${r.publish_date}　` : ""}
                      {r.next_action ?? ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-10 shrink-0 text-xs text-neutral-500">{label}</span>
      {children}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border px-3 py-1 text-xs transition-colors ${
        active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
      }`}
    >
      {children}
    </Link>
  );
}

function Badge({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-xs ${
        tone === "dark" ? "border-neutral-900 text-neutral-900" : "border-neutral-300 text-neutral-600"
      }`}
    >
      {children}
    </span>
  );
}
