import Link from "next/link";
import Image from "next/image";
import { ProfileImage } from "@/components/profile-image";
const selectedWork = [
  {
    title: "Vector income planning",
    subtitle: "Conceptual model & requirements",
    href: "/work/vector-income-architecture/",
    image: "/images/work/vector-income.webp",
    alt: "Vector’s envelope-planning interface",
  },
  {
    title: "Vector performance",
    subtitle: "Investigation & validation",
    href: "/work/vector-performance-investigation/",
    image: "/images/work/vector-validation.webp",
    alt: "Vector’s review and validation artwork",
  },
  {
    title: "Personal portfolio",
    subtitle: "Website design & development",
    href: "/work/portfolio-design/",
    image: "/images/work/portfolio.webp",
    alt: "The design of JJ Lowery’s portfolio",
  },
];
export default function Home() {
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
          <div className="work-grid">
            {selectedWork.map((work) => (
              <Link
                key={work.href}
                className="work-card"
                href={work.href}
                prefetch={false}
              >
                <div className="work-image">
                  <Image
                    unoptimized
                    src={work.image}
                    alt={work.alt}
                    width="640"
                    height="480"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="work-caption">
                  <h3>{work.title}</h3>
                  <p>{work.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
