import type { Metadata } from "next";
import { ArrowIcon, SocialIcon } from "@/components/icons";
import { socialLinks } from "@/data/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with JJ Lowery on LinkedIn, X, or Instagram.",
};

const contactNames = {
  LinkedIn: "James (JJ) Lowery",
  X: "@JJ_incredible",
  Instagram: "@jj_incredible",
};

export default function ContactPage() {
  const contacts = [...socialLinks].sort(
    (a, b) => Number(b.label === "LinkedIn") - Number(a.label === "LinkedIn"),
  );
  return (
    <section className="info-page contact-page" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <header className="page-intro">
          <h1 id="contact-title" className="page-title">
            contact
          </h1>
          <p>Connect with me on LinkedIn.</p>
        </header>
        <ul className="contact-list">
          {contacts.map((contact) => (
            <li key={contact.label}>
              <a href={contact.href} target="_blank" rel="noopener noreferrer">
                <SocialIcon name={contact.label} />
                <span className="contact-label">
                  <span className="contact-platform">{contact.label}</span>
                  <span className="contact-name">
                    {contactNames[contact.label]}
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <ArrowIcon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
