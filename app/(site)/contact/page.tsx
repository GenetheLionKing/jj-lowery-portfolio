import { AppPageAnalytics } from "@/components/app-analytics";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SocialIcon } from "@/components/icons";
import { ProfileImage } from "@/components/profile-image";
import { socialLinks } from "@/data/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with JJ Lowery on social media or send an email.",
};

export default function ContactPage() {
  const contacts = [...socialLinks].sort(
    (a, b) => Number(b.label === "LinkedIn") - Number(a.label === "LinkedIn"),
  );
  return (
    <div className="contact-page">
      <AppPageAnalytics path="/contact/" />
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="container contact-hero-inner">
          <div className="contact-intro">
            <h1 id="contact-title" className="page-title">
              contact.
            </h1>
            <p>Get in touch on social media or send me an email.</p>
            <ul
              className="contact-socials"
              aria-label="Find JJ on social media"
            >
              {contacts.map((contact) => (
                <li key={contact.label}>
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="contact-social-icon">
                      <SocialIcon name={contact.label} />
                    </span>
                    <span>
                      {contact.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ProfileImage sizes="(max-width: 750px) 320px, (max-width: 1100px) 45vw, 560px" />
        </div>
      </section>
      <section className="contact-email" aria-labelledby="contact-email-title">
        <div className="container">
          <h2 id="contact-email-title">Send me an email</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
