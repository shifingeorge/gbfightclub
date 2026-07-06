import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { isAdmin } from "../../../actions";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return new Response("Not authorized", { status: 403 });
  }

  const { id } = await params;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return new Response("Convex not configured", { status: 500 });

  const client = new ConvexHttpClient(url);
  const [event, registrations] = await Promise.all([
    client.query(api.events.getById, { id: id as Id<"events"> }),
    client.query(api.registrations.listForEvent, { eventId: id as Id<"events"> }),
  ]);

  const header = [
    "Name",
    "DOB",
    "Gender",
    "Phone",
    "Email",
    "Discipline",
    "Weight (kg)",
    "Experience",
    "Emergency contact",
    "Payment status",
    "Attended",
    "Registered at",
  ];

  type Row = {
    name: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    discipline: string;
    weightKg: number;
    experienceNote?: string;
    emergencyContact: string;
    paymentStatus: string;
    attended: boolean;
    _creationTime: number;
  };

  const rows = (registrations as Row[]).map((r) =>
    [
      r.name,
      r.dob,
      r.gender,
      r.phone,
      r.email,
      r.discipline,
      String(r.weightKg),
      r.experienceNote ?? "",
      r.emergencyContact,
      r.paymentStatus,
      r.attended ? "yes" : "no",
      new Date(r._creationTime).toISOString(),
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");
  const filename = `${(event?.slug as string) ?? id}-registrations.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
