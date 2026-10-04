import type { Metadata } from "next";
import { SelectedWorkGrid } from "@/components/selected-work-grid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected systems work on Vector and the design and development of JJ Lowery’s portfolio.",
};

export default function PortfolioPage() {
  return (
    <section className="portfolio-page" aria-labelledby="portfolio-title">
      <div className="container">
        <header className="page-intro">
          <h1 id="portfolio-title" className="page-title">
            portfolio
          </h1>
          <p>Selected systems work and this site.</p>
        </header>
        <SelectedWorkGrid headingLevel="h2" />
      </div>
    </section>
  );
}
