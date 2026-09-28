"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/application-form";
import { submitRadioApplication } from "@/app/actions/submit-radio-application";
import type { FormState } from "@/app/actions/submit-application";
import { radioCampaign } from "@/lib/radio";

const initialFormState: FormState = { ok: null };

const inputClass = "h-11 rounded-none";

export function RadioApplicationForm() {
  const [state, formAction, pending] = useActionState(
    submitRadioApplication,
    initialFormState
  );

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="space-y-10" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website（記入不要）</Label>
        <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="bandName" label="バンド名" required error={errors.bandName?.[0]}>
        <Input
          id="bandName"
          name="bandName"
          className={inputClass}
          defaultValue={values.bandName ?? ""}
          aria-invalid={Boolean(errors.bandName)}
        />
      </Field>

      <Field id="contactName" label="ご担当者のお名前" required error={errors.contactName?.[0]}>
        <Input
          id="contactName"
          name="contactName"
          className={inputClass}
          defaultValue={values.contactName ?? ""}
          aria-invalid={Boolean(errors.contactName)}
        />
      </Field>

      <Field
        id="email"
        label="メールアドレス"
        required
        description="結果のご連絡に使います。"
        error={errors.email?.[0]}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          defaultValue={values.email ?? ""}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>

      <Field id="xAccount" label="XアカウントのID" required error={errors.xAccount?.[0]}>
        <Input
          id="xAccount"
          name="xAccount"
          placeholder="@から"
          className={inputClass}
          defaultValue={values.xAccount ?? ""}
          aria-invalid={Boolean(errors.xAccount)}
        />
      </Field>

      <Field id="base" label="活動拠点" required error={errors.base?.[0]}>
        <Input
          id="base"
          name="base"
          placeholder="例：東京・下北沢"
          className={inputClass}
          defaultValue={values.base ?? ""}
          aria-invalid={Boolean(errors.base)}
        />
      </Field>

      <Field
        id="songUrl"
        label="番組でかけたい曲の音源リンク"
        required
        description="YouTube・Spotify・SoundCloud など"
        error={errors.songUrl?.[0]}
      >
        <Input
          id="songUrl"
          name="songUrl"
          type="url"
          placeholder="https://"
          className={inputClass}
          defaultValue={values.songUrl ?? ""}
          aria-invalid={Boolean(errors.songUrl)}
        />
      </Field>

      <Field
        id="savedMoment"
        label="あなたが音楽に救われた瞬間を教えてください"
        required
        description="100〜200字程度で大丈夫です。"
        error={errors.savedMoment?.[0]}
      >
        <Textarea
          id="savedMoment"
          name="savedMoment"
          rows={6}
          className="rounded-none"
          defaultValue={values.savedMoment ?? ""}
          aria-invalid={Boolean(errors.savedMoment)}
        />
      </Field>

      <Field
        id="whoToSave"
        label="あなたの音楽は、誰を救えると思いますか"
        required
        description="救われたと言われた経験や、ファンからの言葉があれば教えてください。なければ、届けたい相手を思い浮かべて書いてください。100〜200字程度で構いません。"
        error={errors.whoToSave?.[0]}
      >
        <Textarea
          id="whoToSave"
          name="whoToSave"
          rows={6}
          className="rounded-none"
          defaultValue={values.whoToSave ?? ""}
          aria-invalid={Boolean(errors.whoToSave)}
        />
      </Field>

      <Field
        id="members"
        label="出演したい人数"
        required
        description="当日スタジオに来たい方の人数（1名から）。ご希望をもとに調整します。"
        error={errors.members?.[0]}
      >
        <Input
          id="members"
          name="members"
          placeholder="例：2名"
          className={`${inputClass} sm:w-40`}
          defaultValue={values.members ?? ""}
          aria-invalid={Boolean(errors.members)}
        />
      </Field>

      <Check
        name="canAttend"
        required
        defaultChecked={values.canAttend === "on"}
        error={errors.canAttend?.[0]}
      >
        {radioCampaign.airDateShort}の放送時間に、メンバーのうち1名以上がスタジオへ来られます
      </Check>

      <Field id="message" label="その他、伝えておきたいこと">
        <Textarea
          id="message"
          name="message"
          rows={3}
          className="rounded-none"
          defaultValue={values.message ?? ""}
        />
      </Field>

      <fieldset className="space-y-4 border-t border-neutral-200 pt-10">
        <legend className="sr-only">同意事項</legend>
        <Check
          name="consentArchive"
          required
          defaultChecked={values.consentArchive === "on"}
          error={errors.consentArchive?.[0]}
        >
          出演した場合、放送回を後日 YouTube・note などで公開することに同意します
        </Check>
        <Check
          name="consentLine"
          required
          defaultChecked={values.consentLine === "on"}
          error={errors.consentLine?.[0]}
        >
          出演が決まった場合、放送前の打ち合わせのため、連絡先をパーソナリティに伝え、LINEでやりとりすることに同意します
        </Check>
        <Check name="consentArticle" defaultChecked={values.consentArticle === "on"}>
          回答内容を、Simple Records が記事で紹介するバンドを探す際の参考にすることに同意します
        </Check>
        <p className="text-xs leading-relaxed text-neutral-500">
          ご記入いただいた連絡先は、この募集と取材に関するご連絡にのみ使います。出演が決まった方の連絡先は、放送前のやりとりのためにパーソナリティにもお伝えします。
        </p>
      </fieldset>

      {state.ok === false && state.message && !state.errors && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {state.message}
        </div>
      )}

      {state.ok === false && state.errors && state.message && (
        <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {state.message}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 w-full rounded-none text-base font-normal tracking-wide sm:w-auto sm:px-16"
        >
          {pending ? "送信中…" : "応募する"}
        </Button>
      </div>
    </form>
  );
}

function Check({
  name,
  required,
  defaultChecked,
  error,
  children,
}: {
  name: string;
  required?: boolean;
  defaultChecked?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="flex cursor-pointer items-start gap-3 border border-neutral-200 p-4 text-sm leading-relaxed text-neutral-900 transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-50"
      >
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={Boolean(error)}
          className="mt-1 size-4 shrink-0 accent-neutral-900"
        />
        <span>
          {children}
          <span className="ml-2 text-xs text-neutral-500">
            {required ? "必須" : "任意"}
          </span>
        </span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
