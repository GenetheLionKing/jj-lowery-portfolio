import { notFound } from "next/navigation";
import type { ReactNode } from "react";
export const metadata = { robots: { index: false, follow: false } };
export default function ReviewLayout({ children }: { children: ReactNode }) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <>
      <aside className="review-note container">
        Design review only · unpublished proposal · does not change CMS content
      </aside>
      {children}
    </>
  );
}
