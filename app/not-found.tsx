import { NotFoundContent } from "@/components/not-found-content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnalyticsExcluded } from "@/components/app-analytics";

export default function NotFound() {
  return (
    <>
      <AnalyticsExcluded />
      <SiteHeader />
      <main id="main">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
