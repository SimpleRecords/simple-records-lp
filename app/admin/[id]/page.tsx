import Link from "next/link";
import { notFound } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { updateApplication } from "@/app/admin/actions";
import {
  DETAIL_LABELS,
  KIND_LABELS,
  SELECTION_LABELS,
  STAGE_LABELS,
  formatDate,
  type Application,
} from "@/lib/admin";
import { AdminHeader } from "../admin-header";

const field = "w-full border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";

export default async function ApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const supabase = await createSessionClient();
  const { data } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const a = data as Application;

  const details = Object.entries(a.details ?? {})
    .filter(([, v]) => v !== "" && v !== null)
    .sort(([x], [y]) => order(x) - order(y));

  const save = updateApplication.bind(null, a.id);

  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Link href="/admin" className="text-xs text-neutral-500 underline-offset-4 hover:underline">
          一覧に戻る
        </Link>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="text-2xl font-normal">{a.band_name}</h1>
          <span className="text-sm text-neutral-500">
            {KIND_LABELS[a.kind]}
            {a.purpose ? `・${a.purpose}` : ""}
          </span>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          受付 {formatDate(a.created_at)}
          {a.source === "import" ? "（応募ボードから移行）" : ""}
        </p>

        {saved && <p className="mt-6 border border-neutral-300 bg-white p-3 text-sm">保存しました</p>}
        {error && (
          <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            保存できませんでした。もう一度お試しください
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <section className="space-y-6 border border-neutral-200 bg-white p-6">
            <h2 className="text-sm text-neutral-500">応募内容</h2>
            <Item label="担当者">{a.contact_name}</Item>
            <Item label="連絡先">
              {a.contact && a.contact.includes("@") && !a.contact.startsWith("http") ? (
                <a href={`mailto:${a.contact}`} className="underline underline-offset-4">{a.contact}</a>
              ) : (
                <Linkish value={a.contact} />
              )}
            </Item>
            {details.map(([k, v]) => (
              <Item key={k} label={DETAIL_LABELS[k] ?? k}>
                {typeof v === "boolean" ? (v ? "同意する" : "同意しない") : <Linkish value={v} />}
              </Item>
            ))}
          </section>

          <form action={save} className="space-y-5 self-start border border-neutral-200 bg-white p-6">
            <h2 className="text-sm text-neutral-500">対応</h2>
            <Labeled label="段階">
              <select name="stage" defaultValue={a.stage} className={field}>
                {Object.entries(STAGE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Labeled>
            {a.kind === "radio" && (
              <Labeled label="ラジオの選考">
                <select name="radio_selection" defaultValue={a.radio_selection ?? ""} className={field}>
                  <option value="">―</option>
                  {Object.entries(SELECTION_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </Labeled>
            )}
            <Labeled label="次のアクション">
              <textarea name="next_action" rows={3} defaultValue={a.next_action ?? ""} className={field} />
            </Labeled>
            <Labeled label="公開予定日">
              <input type="date" name="publish_date" defaultValue={a.publish_date ?? ""} className={field} />
            </Labeled>
            <Labeled label="記事のURL">
              <input type="url" name="article_url" defaultValue={a.article_url ?? ""} className={field} />
            </Labeled>
            <Labeled label="メモ">
              <textarea name="memo" rows={6} defaultValue={a.memo ?? ""} className={field} />
            </Labeled>
            <button type="submit" className="h-11 w-full bg-neutral-900 text-sm text-white hover:bg-neutral-700">
              保存する
            </button>
            <p className="text-xs text-neutral-500">最終更新 {formatDate(a.updated_at)}</p>
          </form>
        </div>
      </main>
    </>
  );
}

const ORDER = Object.keys(DETAIL_LABELS);
const order = (k: string) => (ORDER.includes(k) ? ORDER.indexOf(k) : ORDER.length);

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-neutral-500">{label}</p>
      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-900">
        {children || "―"}
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

/** 値が1つの URL ならリンクにする */
function Linkish({ value }: { value: string | null }) {
  if (!value) return null;
  if (/^https?:\/\/\S+$/.test(value.trim())) {
    return (
      <a href={value.trim()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        {value}
      </a>
    );
  }
  return <>{value}</>;
}
