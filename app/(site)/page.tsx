import { ProfileImage } from "@/components/profile-image";
import { SelectedWorkGrid } from "@/components/selected-work-grid";
import { getPublicContent } from "@/content/public";
import { selectedCases } from "@/content/catalog";
export default async function Home() {
  const { cases } = await getPublicContent();
  return (
    <>
      <section id="about" className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="sr-only">
          JJ Lowery — business systems analyst and software builder
        </h1>
        <div className="container hero-stage">
          <div className="competency competency-analysis">
            <h2>analyst</h2>
            <p>
              I turn business problems into clear requirements, workflows, and
              rules.
            </p>
          </div>
          <ProfileImage />
          <div className="competency competency-building">
            <h2>builder</h2>
            <p>
              I build and improve software with AI assistance, then test that it
              works.
            </p>
          </div>
        </div>
      </section>
      <section id="work" className="selected-work" aria-labelledby="work-title">
        <div className="container">
          <h2 id="work-title" className="work-heading">
            <span>Selected work</span>
          </h2>
          <SelectedWorkGrid cases={selectedCases(cases).slice(0, 3)} />
        </div>
      </section>
    </>
  );
}
