// A service offering shown on a unit page. Most units just list a name —
// pricing comes from the live backend catalogue once it's seeded. A service
// can instead carry:
//  - a fixed, publishable price (shows even before the backend is wired up)
//  - status "quote": too bespoke to price up front (e.g. custom software —
//    every build is different), shown with a "contact us for a quote" tag
//  - status "coming-soon": listed so people know it's on the way, but not
//    bookable or priced yet
export type UnitService =
  | string
  | { name: string; price: string }
  | { name: string; status: "quote" | "coming-soon" };

export type BusinessUnit = {
  slug: string;
  mark: string; // single glyph used as the crest mark
  name: string;
  tagline: string;
  description: string;
  services: UnitService[];
  image: string;
  // Optional division crest (transparent PNG) shown on this unit's page,
  // alongside the DAKESLIV GROUP mark. Only grooming and events have one
  // of their own so far.
  logo?: string;
  // When true, this unit's services are too variable (guest count, menu,
  // décor, logistics, etc.) to quote from a fixed price list. The unit page
  // skips the price/Book list entirely and shows a "contact us for a quote"
  // call to action instead, for every client's order to be priced on its
  // own terms.
  quoteOnly?: boolean;
};

export const businessUnits: BusinessUnit[] = [
  {
    slug: "grooming",
    mark: "G",
    name: "Grooming & Wellness",
    tagline: "Professional grooming, delivered to you.",
    description:
      "Mobile grooming and wellness, brought to homes, hotels, offices, and events across Nairobi.",
    services: [
      "Haircuts, skin fades & beard grooming",
      "Hair styling, braiding, weaving & wigs",
      "Manicures, pedicures & makeup",
      "Bridal packages & special occasions",
      "Massage & relaxation treatments",
    ],
    image: "/images/grooming.png",
    logo: "/logos/grooming.png",
  },
  {
    slug: "events",
    mark: "E",
    name: "Catering & Event Management",
    tagline: "International planning. Trusted local execution.",
    description:
      "Full-service event planning for weddings, corporate events, and diaspora celebrations across Kenya.",
    services: [
      "Destination weddings & diaspora celebrations",
      "Corporate & private luxury events",
      "Venue sourcing & supplier management",
      "Décor, catering & entertainment coordination",
      "Guest logistics & transport",
    ],
    image: "/images/events.png",
    logo: "/logos/catering.png",
    quoteOnly: true,
  },
  {
    slug: "security",
    mark: "S",
    name: "VIP Security Solutions",
    tagline: "Protecting people. Protecting businesses.",
    description:
      "Professional security for individuals, businesses, properties, and events, built on reliability and discretion.",
    services: [
      "Event security & crowd management",
      "VIP protection & executive security",
      "Office & retail security",
      "Security consultations & risk assessments",
      "Bodyguard services",
    ],
    image: "/images/security.png",
  },
  {
    slug: "digital",
    mark: "D",
    name: "App & Website Development",
    tagline: "Digital solutions for modern businesses.",
    description:
      "Websites, apps, and booking platforms built for businesses that want a serious online presence.",
    services: [
      { name: "Business & e-commerce websites", status: "quote" },
      { name: "Booking platforms & custom software / apps", status: "quote" },
      { name: "Branding & marketing materials", status: "coming-soon" },
      { name: "Website maintenance & hosting support", status: "coming-soon" },
      { name: "Digital strategy consultation", status: "coming-soon" },
    ],
    image: "/images/digital.png",
  },
];

export const journeySteps = [
  { label: "Browse", detail: "See an overview of all DAKESLIV services." },
  { label: "Choose", detail: "Pick a service from one of four categories." },
  { label: "Sign in", detail: "One phone number, a text code, no password." },
  { label: "Book", detail: "Pick a date and time that works for you." },
  { label: "Pay", detail: "M-Pesa or card, secured at checkout." },
  { label: "Confirmed", detail: "Instant receipt by SMS and email." },
];
