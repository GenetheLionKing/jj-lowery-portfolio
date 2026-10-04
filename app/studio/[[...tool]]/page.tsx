import type { Metadata } from "next";
import Link from "next/link";
import { getSanityPublicConfig } from "@/content/config";
import { StudioLoader } from "@/studio/loader";

export const metadata: Metadata = {
  title: "Publishing",
  robots: { index: false, follow: false },
};
export default function StudioPage() {
  const config = getSanityPublicConfig();
  if (config)
    return (
      <div className="studio-shell">
        <StudioLoader config={config} />
      </div>
    );
  return (
    <main
      id="main"
      className="container setup-page"
      aria-labelledby="studio-title"
    >
      <p className="eyebrow">Publishing Preview</p>
      <h1 id="studio-title">Connect the editor</h1>
      <p>
        The editing system is prepared. A Sanity project and JJ’s owner login
        still need to be set up before anything can be saved or published.
      </p>
      <p>
        This Preview uses repository content. It is not connected to a CMS, and
        the proposed articles have not been published.
      </p>
      <ol>
        <li>
          Approve the project, dataset, owner membership and trusted Studio
          origins.
        </li>
        <li>Configure the two public project identifiers.</li>
        <li>
          Import the reviewed content and test the authenticated publishing
          workflow.
        </li>
      </ol>
      <p>No API token, deployment hook or anonymous write access is needed.</p>
      <Link className="text-link" href="/learn/" prefetch={false}>
        Review Learn →
      </Link>
    </main>
  );
}
