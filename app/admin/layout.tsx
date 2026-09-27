import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理｜Simple Records",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col bg-neutral-50">{children}</div>;
}
