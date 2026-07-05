import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { isAdmin, login, logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Enquiry = {
  _id: string;
  _creationTime: number;
  name: string;
  phone: string;
  interest: string;
  message?: string;
};

async function getEnquiries(): Promise<Enquiry[] | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const client = new ConvexHttpClient(url);
    return (await client.query(api.enquiries.list, {})) as Enquiry[];
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <section className="mx-auto max-w-sm px-4 py-24">
        <p className="eyebrow">Admin</p>
        <h1 className="display mt-3 text-5xl">Locked.</h1>
        {!process.env.ADMIN_PASSWORD && (
          <p className="mt-4 border border-blood-hot px-4 py-3 text-sm text-blood-hot">
            ADMIN_PASSWORD env var is not set — admin is disabled.
          </p>
        )}
        <form action={login} className="mt-8 space-y-4">
          <label htmlFor="password" className="eyebrow block">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border border-rule bg-coal px-4 py-3 text-bone focus:border-bone"
          />
          <button
            type="submit"
            className="w-full bg-blood px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
          >
            Enter
          </button>
        </form>
      </section>
    );
  }

  const enquiries = await getEnquiries();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="display mt-3 text-5xl">Enquiries</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="border border-rule px-4 py-2 text-xs font-semibold uppercase tracking-wide text-bone-dim transition-colors hover:border-bone hover:text-bone"
          >
            Log out
          </button>
        </form>
      </div>

      {enquiries === null ? (
        <p className="mt-10 border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
          Convex isn&apos;t connected yet. Run <code>npx convex dev</code> once
          and set <code>NEXT_PUBLIC_CONVEX_URL</code> to see enquiries here.
        </p>
      ) : enquiries.length === 0 ? (
        <p className="mt-10 border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
          No enquiries yet. They&apos;ll appear here as soon as someone submits
          the contact form.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-150 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-blood">
                <th className="eyebrow py-3 pr-4">When</th>
                <th className="eyebrow py-3 pr-4">Name</th>
                <th className="eyebrow py-3 pr-4">Phone</th>
                <th className="eyebrow py-3 pr-4">Interest</th>
                <th className="eyebrow py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id} className="border-b border-rule align-top">
                  <td className="whitespace-nowrap py-3 pr-4 font-mono text-xs text-bone-dim">
                    {new Date(e._creationTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="py-3 pr-4 font-medium">{e.name}</td>
                  <td className="py-3 pr-4">
                    <a
                      href={`tel:${e.phone}`}
                      className="font-mono underline-offset-4 hover:underline"
                    >
                      {e.phone}
                    </a>
                  </td>
                  <td className="py-3 pr-4">{e.interest}</td>
                  <td className="max-w-xs py-3 text-bone-dim">
                    {e.message ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
