import Link from "next/link";
import Image from "next/image";
import { sizedPublicImage } from "@/content/media";
import type { aboutGallery } from "@/content/catalog";
export function AboutGalleryStrip({
  items,
}: {
  items: ReturnType<typeof aboutGallery>;
}) {
  if (!items.length) return null;
  return (
    <nav className="container story-strip" aria-label="Personal stories">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          aria-label={item.title}
        >
          <Image
            unoptimized
            src={sizedPublicImage(item.image.src, 400)}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            loading="lazy"
          />
        </Link>
      ))}
    </nav>
  );
}
