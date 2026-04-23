"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  submitApplication,
  type FormState,
} from "@/app/actions/submit-application";

const initialFormState: FormState = { ok: null };

const purposeOptions = [
  {
    value: "release",
    label: "リリース情報の掲載",
    hint: "新曲・アルバム等の情報をお送りいただき、記事化します",
  },
  {
    value: "interview",
    label: "バンド紹介記事（インタビュー）",
    hint: "メールまたは口頭でインタビューを行い、記事化します",
  },
  {
    value: "other",
    label: "その他",
    hint: "上記以外のご相談",
  },
];

export function ApplicationForm() {
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialFormState
  );

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="space-y-10" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website（記入不要）</Label>
        <Input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        id="bandName"
        label="バンド名"
        required
        description="正式名称をご記入ください。"
        error={errors.bandName?.[0]}
      >
        <Input
          id="bandName"
          name="bandName"
          required
          defaultValue={values.bandName ?? ""}
          aria-invalid={Boolean(errors.bandName)}
        />
      </Field>

      <Field
        id="representativeName"
        label="代表者のお名前"
        required
        description="連絡窓口となる方のお名前をご記入ください。"
        error={errors.representativeName?.[0]}
      >
        <Input
          id="representativeName"
          name="representativeName"
          required
          defaultValue={values.representativeName ?? ""}
          aria-invalid={Boolean(errors.representativeName)}
        />
      </Field>

      <Field
        id="contact"
        label="ご連絡先"
        required
        description="メールアドレス または SNSアカウントのURL"
        error={errors.contact?.[0]}
      >
        <Input
          id="contact"
          name="contact"
          required
          defaultValue={values.contact ?? ""}
          placeholder="例：example@mail.com / https://x.com/..."
          aria-invalid={Boolean(errors.contact)}
        />
      </Field>

      <fieldset className="space-y-4">
        <legend className="flex items-baseline gap-2 text-base font-normal text-neutral-900">
          希望種別
          <span className="text-xs text-neutral-500">必須</span>
        </legend>
        <RadioGroup
          name="purpose"
          defaultValue={values.purpose}
          className="gap-3"
        >
          {purposeOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`purpose-${option.value}`}
              className="flex cursor-pointer items-start gap-3 border border-neutral-200 p-4 transition-colors has-[[data-checked]]:border-neutral-900 has-[[data-checked]]:bg-neutral-50"
            >
              <RadioGroupItem
                value={option.value}
                id={`purpose-${option.value}`}
                className="mt-1"
              />
              <span className="flex flex-col gap-1">
                <span className="text-sm font-normal text-neutral-900">
                  {option.label}
                </span>
                <span className="text-xs text-neutral-500">{option.hint}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        {errors.purpose?.[0] && (
          <p className="text-xs text-red-600">{errors.purpose[0]}</p>
        )}
      </fieldset>

      <Field
        id="profile"
        label="バンドのプロフィール"
        required
        description="活動歴、編成、ジャンルなど、簡単にご記入ください。"
        error={errors.profile?.[0]}
      >
        <Textarea
          id="profile"
          name="profile"
          rows={4}
          required
          defaultValue={values.profile ?? ""}
          aria-invalid={Boolean(errors.profile)}
        />
      </Field>

      <Field
        id="content"
        label="掲載・取材してほしい内容"
        required
        description="ご希望の内容を自由にお書きください。"
        error={errors.content?.[0]}
      >
        <Textarea
          id="content"
          name="content"
          rows={5}
          required
          defaultValue={values.content ?? ""}
          aria-invalid={Boolean(errors.content)}
        />
        <p className="mt-3 rounded-sm bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
          【記入例】
          <br />
          ・リリース情報：12月発売の新曲◯◯について。制作のきっかけと曲名の由来を書いてほしい
          <br />
          ・バンド紹介：結成3年の歩みと、今のメンバーで大事にしていること
        </p>
      </Field>

      <Field
        id="urls"
        label="SNS・音源のURL"
        description="Spotify / YouTube / X などあればぜひ。"
      >
        <Input id="urls" name="urls" defaultValue={values.urls ?? ""} />
      </Field>

      <Field
        id="message"
        label="その他・メッセージ"
        description="ご質問や一言メッセージがあれば。"
      >
        <Textarea
          id="message"
          name="message"
          rows={3}
          defaultValue={values.message ?? ""}
        />
      </Field>

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
          {pending ? "送信中…" : "送信する"}
        </Button>
        <p className="mt-4 text-xs text-neutral-500">
          送信後、3日以内にご連絡いたします。
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  description,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor={id}
        className="flex items-baseline gap-2 text-base font-normal text-neutral-900"
      >
        {label}
        <span className="text-xs text-neutral-500">
          {required ? "必須" : "任意"}
        </span>
      </Label>
      {description && (
        <p className="text-xs text-neutral-500">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
