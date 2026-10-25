// Placeholder portfolio entries. Replace these with real completed
// projects (and add photos once you're ready to upload them) — they're
// here as examples of the shape/format, not real Dakesliv work.
export type PortfolioProject = {
  slug: string;
  title: string;
  category: string; // matches a galleryCategories slug where relevant
  summary: string;
  highlights: string[];
  year: string;
  link?: string;
  placeholder?: boolean;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "sample-booking-app",
    title: "Sample: Restaurant booking app",
    category: "digital",
    summary:
      "A mobile-first booking and table-management app built for a multi-branch restaurant group.",
    highlights: [
      "Real-time table availability across branches",
      "M-Pesa payment integration at checkout",
      "Admin dashboard for staff to manage bookings",
    ],
    year: "2026",
    placeholder: true,
  },
  {
    slug: "sample-corporate-site",
    title: "Sample: Corporate website redesign",
    category: "digital",
    summary:
      "A full brand and website refresh for a logistics company, built for speed and clarity.",
    highlights: [
      "Modern, mobile-responsive design",
      "SEO-optimised content structure",
      "Lead-capture forms wired to the sales team's inbox",
    ],
    year: "2026",
    placeholder: true,
  },
  {
    slug: "sample-wedding",
    title: "Sample: Diaspora destination wedding",
    category: "events",
    summary:
      "Full-service planning and execution for a 200-guest wedding, coordinated with family abroad.",
    highlights: [
      "Venue, décor and catering fully coordinated",
      "Guest transport and accommodation arranged",
      "On-the-day management so the family could just enjoy it",
    ],
    year: "2026",
    placeholder: true,
  },
];
