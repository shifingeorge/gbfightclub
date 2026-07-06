"use client";

import { useMemo, useState, useTransition } from "react";
import { togglePayment, toggleAttended } from "./actions";

type Registration = {
  _id: string;
  _creationTime: number;
  name: string;
  phone: string;
  email: string;
  discipline: string;
  weightKg: number;
  gender: string;
  paymentStatus: "pending" | "received";
  attended: boolean;
};

export default function RegistrationsTable({
  eventId,
  registrations,
}: {
  eventId: string;
  registrations: Registration[];
}) {
  const [search, setSearch] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("");
  const [pending, startTransition] = useTransition();

  const disciplines = useMemo(
    () => Array.from(new Set(registrations.map((r) => r.discipline))),
    [registrations],
  );

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchesDiscipline = !disciplineFilter || r.discipline === disciplineFilter;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-rule bg-coal px-4 py-2 text-sm text-bone focus:border-bone"
        />
        <select
          value={disciplineFilter}
          onChange={(e) => setDisciplineFilter(e.target.value)}
          className="border border-rule bg-coal px-4 py-2 text-sm text-bone focus:border-bone"
        >
          <option value="">All disciplines</option>
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <a
          href={`/admin/events/${eventId}/export`}
          className="border border-rule px-4 py-2 text-sm font-semibold uppercase tracking-wide text-bone-dim transition-colors hover:border-bone hover:text-bone"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-175 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-blood">
              <th className="eyebrow py-3 pr-4">Name</th>
              <th className="eyebrow py-3 pr-4">Phone</th>
              <th className="eyebrow py-3 pr-4">Discipline</th>
              <th className="eyebrow py-3 pr-4">Weight</th>
              <th className="eyebrow py-3 pr-4">Gender</th>
              <th className="eyebrow py-3 pr-4">Payment</th>
              <th className="eyebrow py-3">Attended</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="border-b border-rule align-top">
                <td className="py-3 pr-4 font-medium">{r.name}</td>
                <td className="py-3 pr-4">
                  <a
                    href={`tel:${r.phone}`}
                    className="font-mono underline-offset-4 hover:underline"
                  >
                    {r.phone}
                  </a>
                </td>
                <td className="py-3 pr-4">{r.discipline}</td>
                <td className="py-3 pr-4 font-mono">{r.weightKg}kg</td>
                <td className="py-3 pr-4">{r.gender}</td>
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() =>
                        togglePayment(
                          eventId,
                          r._id,
                          r.paymentStatus === "pending" ? "received" : "pending",
                        ),
                      )
                    }
                    className={`eyebrow border px-2 py-1 ${
                      r.paymentStatus === "received"
                        ? "border-blood-hot text-blood-hot"
                        : "border-rule text-bone-dim"
                    }`}
                  >
                    {r.paymentStatus}
                  </button>
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() => toggleAttended(eventId, r._id, !r.attended))
                    }
                    className={`eyebrow border px-2 py-1 ${
                      r.attended
                        ? "border-blood-hot text-blood-hot"
                        : "border-rule text-bone-dim"
                    }`}
                  >
                    {r.attended ? "yes" : "no"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="mt-6 text-sm text-bone-dim">No registrations match.</p>
        )}
      </div>
    </div>
  );
}
