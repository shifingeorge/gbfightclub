import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Schedule & Fees",
  description: `Weekly class timetable and membership fees at ${SITE.name}, Kaloor, Kochi. Morning batches from 6:00 AM.`,
};

// TODO(client): replace placeholder timetable + fees with real data.
const TIMETABLE = [
  { day: "Monday", slots: ["6:00 AM Boxing", "6:30 PM Boxing", "7:30 PM Muay Thai"] },
  { day: "Tuesday", slots: ["6:00 AM Kickboxing", "6:30 PM Kickboxing", "7:30 PM MMA"] },
  { day: "Wednesday", slots: ["6:00 AM Boxing", "6:30 PM Boxing", "7:30 PM Muay Thai"] },
  { day: "Thursday", slots: ["6:00 AM Kickboxing", "6:30 PM Kickboxing", "7:30 PM MMA"] },
  { day: "Friday", slots: ["6:00 AM Boxing", "6:30 PM Boxing", "7:30 PM Muay Thai"] },
  { day: "Saturday", slots: ["6:00 AM Kickboxing", "8:00 AM MMA", "6:30 PM Open mat"] },
  { day: "Sunday", slots: ["Rest day"] },
];

const FEES = [
  { plan: "Monthly", price: "₹—", note: "Any one discipline" },
  { plan: "Quarterly", price: "₹—", note: "All disciplines, best value" },
  { plan: "Personal training", price: "₹—", note: "1-on-1, by appointment" },
];

export default function SchedulePage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Schedule & Fees</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            The bell
            <br />
            rings at <span className="text-blood">6</span>.
          </h1>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="eyebrow">Weekly timetable</h2>
          <p className="mt-2 font-mono text-xs text-bone-dim">
            Indicative timetable — confirm your batch on WhatsApp before first
            visit.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-125 border-collapse text-left">
              <tbody>
                {TIMETABLE.map((row) => (
                  <tr key={row.day} className="border-t border-rule last:border-b">
                    <th
                      scope="row"
                      className="display w-36 py-5 pr-4 align-top text-2xl font-bold"
                    >
                      {row.day.slice(0, 3)}
                      <span className="text-bone-dim">
                        {row.day.slice(3)}
                      </span>
                    </th>
                    <td className="py-5">
                      <ul className="flex flex-wrap gap-x-8 gap-y-2">
                        {row.slots.map((s) => (
                          <li
                            key={s}
                            className={`font-mono text-sm ${s === "Rest day" ? "text-bone-dim" : ""}`}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-coal">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="eyebrow">Fees</h2>
          <div className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {FEES.map((f) => (
              <div key={f.plan} className="bg-coal p-6">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  {f.plan}
                </p>
                <p className="display mt-3 text-5xl text-blood">{f.price}</p>
                <p className="mt-2 text-sm text-bone-dim">{f.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-lg text-sm text-bone-dim">
            Fee structure is being finalised — message us and we&apos;ll send
            you current rates and any first-month offers.
          </p>
          <a
            href={waLink(`Hi ${SITE.name}, what are the current fees?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-blood px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
          >
            Ask fees on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
