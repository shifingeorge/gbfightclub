import Link from "next/link";
import { SITE, waLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-blood bg-coal">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="display text-3xl">
              GB<span className="text-blood"> FIGHT CLUB</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-bone-dim">
              {SITE.tagline} All levels, from first class to fight night.
            </p>
            <p className="eyebrow mt-4">
              ★ {SITE.rating.value} · {SITE.rating.count} reviews on{" "}
              {SITE.rating.source}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Find us</p>
            <address className="text-sm not-italic leading-6 text-bone">
              {SITE.address.street}
              <br />
              {SITE.address.locality}, {SITE.address.region}{" "}
              {SITE.address.postalCode}
            </address>
            <p className="mt-3 font-mono text-sm text-bone-dim">
              Open daily from {SITE.opens} AM
            </p>
            <a
              href={`tel:${SITE.phone}`}
              className="mt-3 block font-mono text-sm text-bone underline-offset-4 hover:underline"
            >
              {SITE.phoneDisplay}
            </a>
            <a
              href={waLink(`Hi ${SITE.name}, I have an enquiry.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-blood-hot underline-offset-4 hover:underline"
            >
              Message on WhatsApp →
            </a>
          </div>

          <div>
            <p className="eyebrow mb-4">Pages</p>
            <ul className="space-y-2 text-sm">
              {[
                ["/programs", "Programs"],
                ["/schedule", "Schedule & Fees"],
                ["/trainers", "Trainers"],
                ["/gallery", "Gallery"],
                ["/events", "Events"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-bone-dim transition-colors hover:text-bone"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-rule pt-6 font-mono text-xs text-bone-dim">
          © {new Date().getFullYear()} {SITE.name} · Kaloor, Ernakulam, Kerala
        </p>
      </div>
    </footer>
  );
}
