"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { SITE, waLink } from "@/lib/site";

const INTERESTS = ["Boxing", "Kickboxing", "Muay Thai", "MMA", "Not sure yet"];

const initialState: EnquiryState = { status: "idle" };

export default function EnquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <div className="border-2 border-blood p-8">
        <p className="display text-4xl">
          Enquiry <span className="text-blood">received</span>.
        </p>
        <p className="mt-4 text-sm text-bone-dim">
          We&apos;ll call you back soon. In a hurry? Message us directly:
        </p>
        <a
          href={waLink(`Hi ${SITE.name}, I just sent an enquiry from the website.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blood px-5 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
        >
          WhatsApp us
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="eyebrow block">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone placeholder:text-bone-dim/60 focus:border-bone"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="eyebrow block">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 font-mono text-base text-bone placeholder:text-bone-dim/60 focus:border-bone"
          placeholder="98765 43210"
        />
      </div>

      <div>
        <label htmlFor="interest" className="eyebrow block">
          Interested in
        </label>
        <select
          id="interest"
          name="interest"
          required
          defaultValue=""
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
        >
          <option value="" disabled>
            Pick a discipline
          </option>
          {INTERESTS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow block">
          Message <span className="normal-case">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={1000}
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone placeholder:text-bone-dim/60 focus:border-bone"
          placeholder="Anything we should know — goals, experience, preferred timing"
        />
      </div>

      {state.status === "error" && (
        <p className="border border-blood-hot px-4 py-3 text-sm text-blood-hot">
          {state.error}
        </p>
      )}

      {state.status === "fallback" && (
        <div className="border border-rule bg-coal px-4 py-4 text-sm">
          <p className="text-bone-dim">
            The form couldn&apos;t reach our system right now. Send the same
            enquiry on WhatsApp instead — it goes straight to the coaches.
          </p>
          <a
            href={waLink(`Hi ${SITE.name}, I want to enquire about joining.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block bg-blood px-4 py-2 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
          >
            Send on WhatsApp
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blood px-6 py-4 text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
