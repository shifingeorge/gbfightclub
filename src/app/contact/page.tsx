import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name} — Ashoka Road, Kaloor, Ernakulam. Call, WhatsApp or send an enquiry to book a trial class.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            Step into
            <br />
            the <span className="text-blood">gym</span>.
          </h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={waLink(`Hi ${SITE.name}, I want to book a trial class.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blood px-7 py-4 text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
            >
              WhatsApp us
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="border border-rule px-7 py-4 font-mono text-base font-semibold text-bone transition-colors hover:border-bone"
            >
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="eyebrow">Send an enquiry</h2>
            <p className="mt-3 max-w-sm text-sm text-bone-dim">
              Leave your details and a coach will call you back about batches,
              fees and trial classes.
            </p>
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </div>

          <div>
            <h2 className="eyebrow">Find us</h2>
            <address className="mt-3 text-base not-italic leading-7 text-bone">
              {SITE.address.street}
              <br />
              {SITE.address.locality}, {SITE.address.region}{" "}
              {SITE.address.postalCode}
            </address>
            <p className="mt-2 font-mono text-sm text-bone-dim">
              Open daily from {SITE.opens} AM
            </p>
            <div className="mt-6 h-80 border border-rule">
              <iframe
                title={`${SITE.name} location map`}
                src={SITE.mapsEmbed}
                className="h-full w-full grayscale invert-[.92] contrast-90"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={SITE.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-blood-hot underline-offset-4 hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
