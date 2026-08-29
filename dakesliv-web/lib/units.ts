export type BusinessUnit = {
  slug: string;
  mark: string; // single glyph used as the crest mark
  name: string;
  tagline: string;
  description: string;
  services: string[];
  image: string;
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
      "Business & e-commerce websites",
      "Booking platforms & customer apps",
      "Branding & marketing materials",
      "Website maintenance & hosting support",
      "Digital strategy",
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
