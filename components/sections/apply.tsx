import { ApplicationForm } from "@/components/application-form";

export function Apply() {
  return (
    <section
      id="apply"
      className="scroll-mt-20 border-t border-neutral-200 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
          Apply
        </p>
        <h2 className="mt-4 text-2xl font-light leading-relaxed sm:text-3xl">
          掲載応募フォーム
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
          必須項目のみで2〜3分で送信できます。内容を確認のうえ、3日以内にご連絡いたします。
        </p>
        <div className="mt-14">
          <ApplicationForm />
        </div>
      </div>
    </section>
  );
}
