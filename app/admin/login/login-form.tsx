"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendLoginLink, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendLoginLink, {});

  if (state.sent) {
    return (
      <p className="border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-700">
        登録済みのアドレスであれば、ログイン用のリンクを送りました。
        メールのリンクは、<strong className="font-normal">このブラウザで</strong>開いてください。
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 rounded-none bg-white"
        />
      </div>
      {state.message && <p className="text-xs text-red-600">{state.message}</p>}
      <Button type="submit" disabled={pending} className="h-11 w-full rounded-none">
        {pending ? "送信中…" : "ログイン用のリンクを送る"}
      </Button>
    </form>
  );
}
