import { LegalPage, type LegalSection } from "@/components/LegalDocument";

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    blocks: [
      { text: "Dakesliv Group Ltd is a company incorporated and operating in Kenya." },
      { text: "Dakesliv operates through various business divisions, which may include:" },
      {
        list: [
          "Dakesliv Grooming & Wellness",
          "Dakesliv Catering & Events Management",
          "Dakesliv Security Solutions",
          "Dakesliv Digital / App & Website Design & Development",
          "Dakesliv Foundation",
          "Other services or business divisions introduced by Dakesliv from time to time.",
        ],
      },
      {
        text: "For purposes of applicable data protection law, Dakesliv may act as a data controller where it determines the purposes and means of processing personal data and may engage data processors where third parties process personal data on Dakesliv's behalf.",
      },
    ],
  },
  {
    heading: "Information we collect",
    blocks: [
      {
        text: "Depending on how you interact with Dakesliv, we may collect contact information, booking and service information, business and project information, payment information, communications and technical information.",
      },
      {
        text: "Contact information may include full name, telephone number, email address, postal address, physical or service location and preferred method of communication.",
      },
      {
        text: "Booking and service information may include booking date and time, service requested, event details, number of guests, project requirements, delivery or service location, preferences, quotation information, payment information and communications relating to the service.",
      },
      {
        text: "Business and project information may include company or organisation name, job title, business contact details, project requirements, technical specifications, event information, contracts, work orders and invoices.",
      },
      {
        text: "Payment information may be received when payments are made to Dakesliv. Where payment is processed through a third-party payment provider, that provider may independently process certain payment information under its own privacy policy.",
      },
      {
        text: "Communications may include emails, enquiry forms, messages, booking communications and customer-service correspondence.",
      },
      {
        text: "Technical information may include IP address, browser type, device type, operating system, pages visited, approximate location derived from technical information, referring website, date and time of access and Website usage information.",
      },
    ],
  },
  {
    heading: "Information you choose to provide",
    blocks: [
      { text: "You are not generally required to provide personal information simply to browse the public areas of the Website." },
      { text: "Certain information may be necessary to request a quotation, make an enquiry, make a booking, request a callback, purchase a service, enter into a contract, receive customer support, participate in a Dakesliv initiative or use a service requiring personal information." },
    ],
  },
  {
    heading: "How we use personal data",
    blocks: [
      { text: "We may use personal data to provide services, administer our business, operate and improve the Website, communicate with customers, comply with legal and regulatory requirements, prevent fraud, improve services and conduct legitimate business administration." },
    ],
  },
  {
    heading: "Our lawful bases for processing",
    blocks: [
      { text: "Depending on the circumstances, Dakesliv may process personal data on one or more lawful bases recognised under applicable law, including consent, performance of a contract, compliance with a legal obligation, legitimate interests where applicable, public interest where applicable, or another lawful basis permitted by law." },
      { text: "Where we rely on consent, you may withdraw that consent, subject to any legal or contractual consequences of doing so." },
    ],
  },
  {
    heading: "Marketing communications",
    blocks: [
      { text: "Dakesliv may send marketing communications where permitted by law and where the appropriate legal basis or consent applies." },
      { text: "You may unsubscribe from marketing communications at any time by following the unsubscribe instructions provided or contacting Dakesliv directly." },
    ],
  },
  {
    heading: "Sharing personal data",
    blocks: [
      { text: "Dakesliv may share personal data where reasonably necessary for legitimate business, contractual or legal purposes." },
      { text: "Recipients may include employees and authorised personnel, contractors, approved suppliers, event service providers, technology providers, website hosting providers, payment providers, professional advisers, accountants, auditors, insurers, legal advisers, regulators, government authorities and other service providers acting on our behalf." },
      { text: "We will seek to limit information shared to what is reasonably necessary for the relevant purpose." },
    ],
  },
  {
    heading: "Third-party service providers",
    blocks: [
      { text: "Some Dakesliv services involve third-party suppliers such as caterers, decorators, photographers, videographers, DJs, transport providers, security personnel, equipment providers and other approved service providers." },
      { text: "Where sharing personal information is necessary to deliver the service you have requested, we may provide the relevant information to the appropriate service provider." },
    ],
  },
  {
    heading: "International and cross-border data transfers",
    blocks: [
      { text: "Dakesliv may use service providers whose systems or infrastructure are located outside Kenya." },
      { text: "Where personal data is transferred outside Kenya, Dakesliv will take steps required by applicable law concerning cross-border transfers, including consideration of appropriate safeguards and any applicable consent or other legal basis." },
    ],
  },
  {
    heading: "Data retention",
    blocks: [
      { text: "Dakesliv will retain personal data only for as long as reasonably necessary for the purpose for which it was collected, unless a longer period is required or permitted by law." },
      { text: "Retention periods may depend on the nature of the information, purpose of collection, ongoing client relationship, contractual requirements, legal and regulatory obligations, accounting and tax requirements, dispute resolution, fraud prevention and legal claims." },
      { text: "When personal data is no longer required, we will take reasonable steps to delete, anonymise or securely dispose of it, subject to applicable legal requirements." },
    ],
  },
  {
    heading: "Data security",
    blocks: [
      { text: "Dakesliv takes reasonable technical and organisational measures to protect personal data against unauthorised access, disclosure, alteration, loss, misuse, destruction and other unlawful or unauthorised processing." },
      { text: "Security measures may include access controls, password protection, restricted access to personal data, secure systems, staff procedures, supplier controls and other safeguards appropriate to the nature of the information." },
    ],
  },
  {
    heading: "Your data protection rights",
    blocks: [
      { text: "Subject to applicable law, you may have rights including the right to be informed, access personal data, request correction, object to certain processing, request deletion or erasure in applicable circumstances, request restriction, request data portability where applicable, and withdraw consent where processing is based on consent." },
    ],
  },
  {
    heading: "How to exercise your rights",
    blocks: [
      { text: "You can reach us using the details below. Please provide sufficient information to allow us to identify you and understand your request — we may need to verify your identity before releasing or changing personal information." },
      { text: "Dakesliv Group Ltd" },
      { text: "P.O. Box 104566 – 00100, Nairobi, Kenya" },
      { text: "Privacy email: dakeslivgroup@gmail.com" },
      { text: "Telephone: +254 18 2278161" },
    ],
  },
  {
    heading: "Children's personal data",
    blocks: [
      { text: "Dakesliv recognises the importance of protecting children's personal information." },
      { text: "Our general Website is not intended to encourage children to submit personal information independently." },
      { text: "Where Dakesliv processes personal data relating to a child, we will apply the requirements of applicable Kenyan data-protection law, including appropriate parental or guardian consent where required." },
      { text: "This is particularly relevant to Dakesliv Foundation activities involving children." },
    ],
  },
  {
    heading: "Photographs, video and event material",
    blocks: [
      { text: "Dakesliv may process photographs, videos or other recorded material in connection with events, projects or marketing." },
      { text: "Where identifiable individuals are involved, Dakesliv will seek appropriate consent or rely on another lawful basis where applicable." },
    ],
  },
  {
    heading: "Sensitive personal data",
    blocks: [
      { text: "Certain categories of personal information receive additional protection under Kenyan law." },
      { text: "Dakesliv will only collect sensitive personal data where there is a legitimate reason and an appropriate lawful basis for doing so." },
      { text: "We ask customers not to submit sensitive personal information through ordinary Website enquiry forms unless specifically requested by Dakesliv for a legitimate service purpose." },
    ],
  },
  {
    heading: "Cookies",
    blocks: [
      { text: "Our Website may use cookies and similar technologies to operate the Website, remember preferences, understand traffic, improve functionality, maintain security and measure communications." },
      { text: "Please see our Cookie Policy for more information." },
    ],
  },
  {
    heading: "Third-party websites",
    blocks: [
      { text: "Our Website may contain links to third-party websites." },
      { text: "Dakesliv is not responsible for the privacy practices of third-party websites." },
    ],
  },
  {
    heading: "Data breaches",
    blocks: [
      { text: "Dakesliv maintains procedures intended to identify, investigate and respond to personal-data security incidents." },
      { text: "Where a personal-data breach occurs, Dakesliv will take appropriate steps required under applicable law, which may include notifying affected individuals and/or the Office of the Data Protection Commissioner where legally required." },
    ],
  },
  {
    heading: "Privacy complaints",
    blocks: [
      { text: "If you have concerns about how Dakesliv handles your personal data, please contact us first so that we can investigate and attempt to resolve the matter." },
      { text: "You may also have the right to make a complaint to the Office of the Data Protection Commissioner (ODPC)." },
    ],
  },
  {
    heading: "Changes to this Privacy Policy",
    blocks: [
      { text: "Dakesliv may update this Privacy Policy from time to time." },
      { text: "The updated version will be published on the Website together with a revised \"Last Updated\" date." },
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

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="26 August 2026"
      lastUpdated="26 August 2026"
      intro={[
        {
          text: "Dakesliv Group Ltd (\"Dakesliv\", \"we\", \"us\", \"our\" or \"the Company\") respects your privacy and is committed to protecting the personal information entrusted to us.",
        },
        {
          text: "This Privacy Policy explains how Dakesliv Group Ltd collects, uses, stores, shares and protects personal data when you visit our website, contact us, request information, make an enquiry, use our services, make a booking, enter into an agreement with us, or otherwise interact with us.",
        },
        {
          text: "This Privacy Policy should be read together with our Website Terms & Conditions and Cookie Policy.",
        },
        {
          text: "Dakesliv processes personal data in accordance with applicable Kenyan data protection laws, including the Data Protection Act, 2019 and applicable regulations and guidance issued by the Office of the Data Protection Commissioner (ODPC).",
        },
      ]}
      sections={sections}
    />
  );
}
