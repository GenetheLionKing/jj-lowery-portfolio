import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/content/model";
import { sizedPublicImage } from "@/content/media";
import { ArrowIcon } from "./icons";
export function EditorialPage({
  title,
  summary,
  label,
  backHref,
  backLabel,
  image,
  children,
}: {
  title: string;
  summary?: string;
  label?: ReactNode;
  backHref: string;
  backLabel: string;
  image?: Article["mainImage"];
  children: ReactNode;
}) {
  return (
    <article className="article-page container">
      <Link prefetch={false} href={backHref} className="text-link back-link">
        <ArrowIcon direction="left" />
        {backLabel}
      </Link>
      <header className="article-heading">
        {label && <p className="eyebrow">{label}</p>}
        <h1>{title}</h1>
        {summary && <p>{summary}</p>}
      </header>
      {image && (
        <Image
          unoptimized
          className="article-main-image"
          src={sizedPublicImage(image.src, 960)}
          alt={image.alt}
          width={image.width}
          height={image.height}
        />
      )}
      <div className="article-body">{children}</div>
    </article>
  );
}
