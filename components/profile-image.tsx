import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

/** Add public/images/profile_smile.jpg and rebuild; no code change is required. */
export function ProfileImage({ className = "" }: { className?: string }) {
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public/images/profile_smile.jpg"),
  );

  return (
    <figure className={`profile-figure ${className}`}>
      <div
        className={`portrait-frame${hasPortrait ? " portrait-frame--photo" : ""}`}
      >
        {hasPortrait ? (
          <Image
            src="/images/profile_smile.jpg"
            alt="Professional portrait of James “JJ” Lowery"
            fill
            priority
            unoptimized
            sizes="(max-width: 359px) calc(100vw - 99px), (max-width: 600px) calc(100vw - 107px), (max-width: 1100px) calc(37.6vw - 24px), (max-width: 1432px) calc(37vw - 41px), 489px"
            className="portrait-photo"
          />
        ) : (
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Neutral placeholder for James “JJ” Lowery’s professional portrait"
          >
            <span className="portrait-monogram" aria-hidden="true">
              jj.
            </span>
            <span className="portrait-placeholder-label micro">
              Portrait forthcoming
            </span>
          </div>
        )}
        <span className="portrait-index micro" aria-hidden="true">
          JJ / 01
        </span>
        <span className="portrait-registration" aria-hidden="true" />
      </div>
      <figcaption>
        <span>James “JJ” Lowery</span>
        <span className="micro">The person behind the process</span>
      </figcaption>
    </figure>
  );
}
