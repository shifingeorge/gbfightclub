// Single source of truth for club facts used across pages, SEO, and JSON-LD.
// TODO(client): replace placeholder phone/WhatsApp/fees/timetable when provided.

export const SITE = {
  name: "GB Fight Club",
  legalName: "GB Fight Club",
  tagline: "Boxing. Kickboxing. Muay Thai. MMA.",
  description:
    "GB Fight Club is a martial arts gym on Ashoka Road, Kaloor, Ernakulam (Kochi). Boxing, kickboxing, Muay Thai and MMA training for all levels, from 6:00 AM daily.",
  url: "https://gbfightclub.in", // TODO(client): confirm final domain
  phone: "+919999999999", // TODO(client): real number
  phoneDisplay: "+91 99999 99999",
  whatsapp: "919999999999", // TODO(client): real number, no plus
  address: {
    street: "Ashoka Road, Kaloor",
    locality: "Ernakulam",
    region: "Kerala",
    postalCode: "682017",
    country: "IN",
  },
  geo: { lat: 10.0041578, lng: 76.291446 },
  opens: "06:00",
  closes: "21:00", // TODO(client): confirm closing time
  rating: { value: 4.9, count: 72, source: "Justdial" },
  mapsEmbed:
    "https://www.google.com/maps?q=10.0041578,76.291446&z=16&output=embed",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=10.0041578,76.291446",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const DISCIPLINES = [
  {
    slug: "boxing",
    name: "Boxing",
    hook: "The sweet science",
    blurb:
      "Footwork, head movement and punching mechanics built from the ground up. Pad work, bag rounds and controlled sparring for those who want it.",
    forWho: "Beginners welcome. Separate competition prep for amateurs.",
    slot: "Mon · Wed · Fri — 6:00 AM & 6:30 PM", // TODO(client): confirm
  },
  {
    slug: "kickboxing",
    name: "Kickboxing",
    hook: "Hands and legs, full circle",
    blurb:
      "Punches, kicks and knees drilled into clean combinations. High-output conditioning rounds that double as the best cardio you will ever do.",
    forWho: "All levels. Great first discipline for fitness-focused members.",
    slot: "Tue · Thu · Sat — 6:00 AM & 6:30 PM", // TODO(client): confirm
  },
  {
    slug: "muay-thai",
    name: "Muay Thai",
    hook: "The art of eight limbs",
    blurb:
      "Elbows, knees, clinch and low kicks — the full Thai arsenal. Traditional pad rounds and clinch work under structured coaching.",
    forWho: "All levels. Fight-team pathway for committed athletes.",
    slot: "Mon · Wed · Fri — 7:30 PM", // TODO(client): confirm
  },
  {
    slug: "mma",
    name: "MMA",
    hook: "Everything, everywhere",
    blurb:
      "Striking, wrestling and ground work blended into one system. Position drilling, situational sparring and fight IQ.",
    forWho: "Some striking or grappling base recommended.",
    slot: "Tue · Thu — 7:30 PM · Sat — 8:00 AM", // TODO(client): confirm
  },
] as const;
