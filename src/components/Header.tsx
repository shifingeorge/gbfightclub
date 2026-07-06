"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE, waLink } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/schedule", label: "Schedule & Fees" },
  { href: "/trainers", label: "Trainers" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="display text-2xl tracking-tight">
          GB<span className="text-blood">&nbsp;FIGHT&nbsp;CLUB</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-bone ${
                pathname === item.href ? "text-bone" : "text-bone-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={waLink(`Hi ${SITE.name}, I want to join a trial class.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blood px-4 py-2 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
          >
            Join now
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 bg-bone transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-bone transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-rule bg-ink px-4 pb-6 pt-2 md:hidden"
          aria-label="Main mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block border-b border-rule py-4 text-lg font-medium uppercase tracking-wide ${
                pathname === item.href ? "text-blood-hot" : "text-bone"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={waLink(`Hi ${SITE.name}, I want to join a trial class.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block bg-blood py-3 text-center text-base font-semibold uppercase tracking-wide text-bone"
          >
            Join now — WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
