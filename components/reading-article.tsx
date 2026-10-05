import Image from "next/image";
import Link from "next/link";
import type { ReadingArticle, RecentArticle } from "@/content/article";
import { sizedPublicImage } from "@/content/media";
import { ArticleBody } from "./article-body";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function ReadingArticlePage({
  article,
  recent = [],
}: {
  article: ReadingArticle;
  recent?: RecentArticle[];
}) {
  return (
    <div className="reading-article">
      <article>
        <header className="reading-heading">
          <h1>{article.title}</h1>
          <p className="reading-subtitle">{article.subtitle}</p>
          <div className="reading-author">
            <Image
              unoptimized
              src="/images/profile-shoulder-320.webp"
              width={64}
              height={64}
              alt=""
            />
            <div>
              <span>JJ Lowery</span>
              {(article.publishedAt || article.updatedAt) && (
                <div className="reading-dates">
                  {article.publishedAt && (
                    <span>
                      Published{" "}
                      <time dateTime={article.publishedAt}>
                        {dateFormat.format(new Date(article.publishedAt))}
                      </time>
                    </span>
                  )}
                  {article.updatedAt &&
                    article.updatedAt !== article.publishedAt && (
                      <span>
                        Updated{" "}
                        <time dateTime={article.updatedAt}>
                          {dateFormat.format(new Date(article.updatedAt))}
                        </time>
                      </span>
                    )}
                </div>
              )}
            </div>
          </div>
        </header>
        {article.image && (
          <figure className="reading-hero">
            <Image
              unoptimized
              priority
              src={sizedPublicImage(article.image.src, 960)}
              alt={article.image.alt}
              width={article.image.width}
              height={article.image.height}
              sizes="(max-width: 720px) calc(100vw - 40px), 680px"
            />
          </figure>
        )}
        <div className="reading-body">
          <ArticleBody body={article.body} />
        </div>
      </article>
      {recent.length > 0 && (
        <aside
          className="reading-recent"
          aria-labelledby="recent-articles-heading"
        >
          <h2 id="recent-articles-heading">Recent articles</h2>
          <ul>
            {recent.map((item) => (
              <li key={item.href}>
                <Link prefetch={false} href={item.href}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
