"use client";

import { useActionState } from "react";
import { submitRegistration, type RegisterState } from "./actions";
import { SITE, waLink } from "@/lib/site";

const GENDERS = ["Male", "Female", "Other"];

const initialState: RegisterState = { status: "idle" };

export default function RegisterForm({
  eventId,
  eventName,
  disciplines,
  feeInr,
}: {
  eventId: string;
  eventName: string;
  disciplines: string[];
  feeInr: number;
}) {
  const boundAction = submitRegistration.bind(null, eventId, disciplines);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.status === "sent") {
    return (
      <div className="border-2 border-blood p-8">
        <p className="display text-4xl">
          You&apos;re <span className="text-blood">in</span>.
        </p>
        <p className="mt-4 font-mono text-sm text-bone-dim">
          Registration ID: {state.registrationId}
        </p>
        <p className="mt-4 text-sm text-bone-dim">
          {feeInr > 0
            ? `Pay ₹${feeInr} at the gym or scan the UPI QR on arrival. Bring this registration ID.`
            : "See you at the event. Bring your registration ID."}
        </p>
        <a
          href={waLink(
            `Hi ${SITE.name}, I just registered for ${eventName}. My registration ID is ${state.registrationId}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blood px-5 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
        >
          Confirm on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="eyebrow block">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone placeholder:text-bone-dim/60 focus:border-bone"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="dob" className="eyebrow block">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            required
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          />
        </div>
        <div>
          <label htmlFor="gender" className="eyebrow block">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            defaultValue=""
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          >
            <option value="" disabled>
              Select
            </option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 font-mono text-base text-bone focus:border-bone"
          />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="discipline" className="eyebrow block">
            Discipline
          </label>
          <select
            id="discipline"
            name="discipline"
            required
            defaultValue=""
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          >
            <option value="" disabled>
              Select
            </option>
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="weightKg" className="eyebrow block">
            Weight (kg)
          </label>
          <input
            id="weightKg"
            name="weightKg"
            type="number"
            required
            min={1}
            max={300}
            step="0.1"
            inputMode="decimal"
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 font-mono text-base text-bone focus:border-bone"
          />
        </div>
      </div>

      <div>
        <label htmlFor="experienceNote" className="eyebrow block">
          Experience <span className="normal-case">(optional)</span>
        </label>
        <textarea
          id="experienceNote"
          name="experienceNote"
          rows={2}
          maxLength={500}
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone placeholder:text-bone-dim/60 focus:border-bone"
          placeholder="Years training, amateur record, first competition, etc."
        />
      </div>

      <div>
        <label htmlFor="emergencyContact" className="eyebrow block">
          Emergency contact number
        </label>
        <input
          id="emergencyContact"
          name="emergencyContact"
          type="tel"
          required
          inputMode="tel"
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 font-mono text-base text-bone focus:border-bone"
        />
      </div>

      {state.status === "error" && (
        <p className="border border-blood-hot px-4 py-3 text-sm text-blood-hot">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blood px-6 py-4 text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting…" : "Submit registration"}
      </button>
    </form>
  );
}
