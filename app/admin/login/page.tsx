import { LoginForm } from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2">
          <p className="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">
            Admin
          </p>
          <h1 className="text-2xl font-light">応募の管理</h1>
          <p className="text-sm leading-relaxed text-neutral-600">
            登録済みのメールアドレスに、ログイン用のリンクを送ります。
          </p>
        </div>
        {error && (
          <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            リンクの有効期限が切れているか、別のブラウザで開かれました。もう一度送ってください。
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
