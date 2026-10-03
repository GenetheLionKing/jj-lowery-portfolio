import Link from "next/link";
import { navigation, socialLinks } from "@/data/profile";
import { SocialIcon } from "@/components/icons";
export function SiteNavigation({ label }: { label: string }) {
  return (
    <nav className="site-navigation" aria-label={label}>
      {navigation.map((item) => (
        <Link
          key={item.label}
          prefetch={false}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
        >
          {item.label}
          {item.external && (
            <span className="sr-only"> (opens in a new tab)</span>
          )}
        </Link>
      ))}
    </nav>
  );
}
export function SocialLinks({ label }: { label: string }) {
  return (
    <nav className="social-links" aria-label={label}>
      {socialLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.label} (opens in a new tab)`}
        >
          <SocialIcon name={item.label} />
        </a>
      ))}
    </nav>
  );
}
