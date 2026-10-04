import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ProfileImage } from "@/components/profile-image";

export const metadata: Metadata = {
  title: "About",
  description:
    "JJ Lowery’s background in business and marketing leadership, systems analysis, and AI-assisted work on Vector.",
};

export default function AboutPage() {
  return (
    <section className="info-page about-page" aria-labelledby="about-title">
      <div className="container about-layout">
        <div className="about-copy">
          <h1 id="about-title" className="page-title">
            about
          </h1>
          <div className="page-copy">
            <p>
              I’ve worked in business and marketing leadership, including
              executive operations and business ownership.
            </p>
            <p>
              Today I focus on systems analysis: requirements, business rules,
              workflows, root-cause analysis, and validation.
            </p>
            <p>
              I develop Vector, my personal-finance app, with AI assistance.
            </p>
          </div>
          <Link
            href="/resume/"
            prefetch={false}
            className="text-link page-link"
          >
            View résumé <ArrowIcon />
          </Link>
        </div>
        <ProfileImage sizes="(max-width: 650px) 220px, (max-width: 900px) 280px, 360px" />
      </div>
    </section>
  );
}
