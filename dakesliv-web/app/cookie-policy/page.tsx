import { LegalPage, type LegalSection } from "@/components/LegalDocument";

const sections: LegalSection[] = [
  {
    heading: "What are cookies?",
    blocks: [
      { text: "Cookies are small text files that may be placed on your computer, smartphone, tablet or other device when you visit a website." },
      { text: "Cookies allow a website to recognise your device and may help the website remember information about your visit." },
      { text: "Similar technologies may also be used for analytics, functionality, security and marketing." },
    ],
  },
  {
    heading: "Why Dakesliv uses cookies",
    blocks: [
      { text: "Dakesliv may use cookies and similar technologies to operate the Website, provide essential functionality, remember preferences, improve performance, understand visitor behaviour, measure traffic, improve services, maintain security, analyse marketing performance and support relevant advertising or communications where applicable." },
    ],
  },
  {
    heading: "Types of cookies we may use",
    blocks: [
      {
        subheading: "Strictly necessary cookies",
        text: "These cookies are necessary for certain Website functions, including security, page navigation, session management, forms, accessibility and basic Website functionality.",
      },
      {
        subheading: "Functional cookies",
        text: "Functional cookies may allow the Website to remember choices or preferences such as language, display or form settings.",
      },
      {
        subheading: "Analytics and performance cookies",
        text: "Where enabled, analytics cookies may help us understand how visitors use our Website, including number of visitors, pages visited, time spent, traffic sources, general device information and Website performance. Where analytics cookies require consent under applicable law, they will only be activated after appropriate consent has been obtained.",
      },
      {
        subheading: "Marketing and advertising cookies",
        text: "Where Dakesliv uses advertising or marketing technologies, cookies or similar technologies may be used to measure advertising effectiveness, understand interactions with advertisements, provide more relevant advertising, limit repeated advertisements or measure marketing campaigns. Marketing cookies will be used only where permitted by applicable law and, where required, after appropriate consent has been obtained.",
      },
      {
        subheading: "Social media and embedded content",
        text: "Our Website may contain content or functionality provided by third parties, such as social media platforms, video platforms, maps, booking platforms, payment services or other external services. These third parties may use their own cookies or similar technologies.",
      },
    ],
  },
  {
    heading: "First-party and third-party cookies",
    blocks: [
      { text: "Some cookies may be placed directly by Dakesliv." },
      { text: "Other cookies may be placed by third-party service providers whose technology is integrated into our Website." },
      { text: "Depending on the Website configuration, these may include analytics providers, advertising providers, social-media platforms, hosting providers, booking systems, payment providers, security services and other technology providers." },
    ],
  },
  {
    heading: "Cookie consent",
    blocks: [
      { text: "Where required by applicable law, Dakesliv will request your consent before placing or using non-essential cookies." },
      { text: "The cookie consent mechanism may allow you to accept all cookies, reject non-essential cookies or select certain categories." },
      { text: "You can change your preferences where the Website provides a cookie-preference mechanism." },
      { text: "Where processing is based on consent, you may withdraw that consent, although withdrawing consent does not affect the lawfulness of processing that occurred before withdrawal." },
    ],
  },
  {
    heading: "Managing cookies through your browser",
    blocks: [
      { text: "Most modern browsers allow you to control or delete cookies through their settings." },
      { text: "You may be able to block cookies, delete existing cookies, receive warnings before cookies are placed or block third-party cookies." },
      { text: "If you disable cookies, certain parts of the Website may not function correctly." },
    ],
  },
  {
    heading: "Cookie preferences",
    blocks: [
      { text: "Where available, the Dakesliv Website may provide a cookie-preference tool that allows you to review and change your preferences." },
      { text: "Your preferences may be stored through a cookie or similar technical mechanism so that the Website remembers your choice." },
    ],
  },
  {
    heading: "Analytics",
    blocks: [
      { text: "If Dakesliv uses an analytics service, the service may collect information concerning how visitors interact with the Website." },
      { text: "Analytics information may be used to understand Website performance and improve the user experience." },
      { text: "The specific analytics provider and technologies used on the Website will be identified in the Website's cookie-management tool or updated Cookie Policy where appropriate." },
    ],
  },
  {
    heading: "Cross-border processing",
    blocks: [
      { text: "Some third-party technology providers may process information outside Kenya." },
      { text: "Where cookie-related information constitutes personal data and is transferred outside Kenya, Dakesliv will apply the requirements of applicable data-protection law concerning international or cross-border transfers." },
    ],
  },
  {
    heading: "Personal data and cookies",
    blocks: [
      { text: "Some cookies may collect information that can be linked to an identifiable individual or device." },
      { text: "Where cookie information constitutes personal data, Dakesliv will handle that information in accordance with our Privacy Policy and applicable data-protection law." },
    ],
  },
  {
    heading: "Changes to this Cookie Policy",
    blocks: [
      { text: "Dakesliv may update this Cookie Policy when our Website changes, new technologies are introduced, third-party services change, our cookie practices change or applicable legal requirements change." },
      { text: "The latest version will be published on the Website with an updated \"Last Updated\" date." },
    ],
  },
  {
    heading: "Contact us",
    blocks: [
      { text: "Dakesliv Group Ltd" },
      { text: "P.O. Box 104566 – 00100, Nairobi, Kenya" },
      { text: "Privacy email: dakeslivgroup@gmail.com" },
      { text: "Telephone: +254 18 2278161" },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      effectiveDate="26 August 2026"
      lastUpdated="26 August 2026"
      intro={[
        {
          text: "This Cookie Policy explains how Dakesliv Group Ltd (\"Dakesliv\", \"we\", \"us\" or \"our\") uses cookies and similar technologies when you visit our website.",
        },
        {
          text: "This Cookie Policy should be read together with our Privacy Policy and Website Terms & Conditions.",
        },
      ]}
      sections={sections}
    />
  );
}
