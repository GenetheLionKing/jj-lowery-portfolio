import { NotFoundContent } from "@/components/not-found-content";
import { AnalyticsExcluded } from "@/components/app-analytics";
export default function NotFound() {
  return (
    <>
      <AnalyticsExcluded />
      <NotFoundContent />
    </>
  );
}
