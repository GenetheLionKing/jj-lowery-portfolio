import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/** Add public/images/profile.jpg and rebuild; no code change is required. */
export function ProfileImage({ className = "" }: { className?: string }) {
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public/images/profile.jpg"),
  );

  return (
    <figure className={`profile-figure ${className}`}>
      <div className="portrait-frame">
        {hasPortrait ? (
          <Image
            src="/images/profile.jpg"
            alt="James “JJ” Lowery"
            fill
            priority
            unoptimized
            sizes="(max-width: 700px) 88vw, 36vw"
            className="portrait-photo"
          />
        ) : (
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Neutral placeholder for James “JJ” Lowery’s professional portrait"
          >
            <span className="portrait-index micro" aria-hidden="true">
              JJ / 01
            </span>
            <span className="portrait-monogram" aria-hidden="true">
              jj.
            </span>
            <span className="portrait-registration" aria-hidden="true" />
            <span className="portrait-placeholder-label micro">
              Portrait forthcoming
            </span>
          </div>
        )}
      </div>
      <figcaption>
        <span>James “JJ” Lowery</span>
        <span className="micro">The person behind the process</span>
      </figcaption>
    </figure>
  );
}
