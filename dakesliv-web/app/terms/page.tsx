import { LegalPage, type LegalSection } from "@/components/LegalDocument";

const sections: LegalSection[] = [
  {
    heading: "About Dakesliv Group Ltd",
    blocks: [
      { text: "Dakesliv Group Ltd is a company incorporated and operating in Kenya." },
      { text: "Dakesliv operates through a number of business divisions and service areas, which may include:" },
      {
        list: [
          "Dakesliv Grooming & Wellness",
          "Dakesliv Catering & Events Management",
          "Dakesliv Security Solutions",
          "Dakesliv Digital / App & Website Design & Development",
          "Dakesliv Foundation",
          "Other services, projects or business divisions that may be introduced by Dakesliv from time to time.",
        ],
      },
      { text: "The availability of any particular service may depend on location, personnel, suppliers, licensing, regulatory requirements, capacity and other operational considerations." },
    ],
  },
  {
    heading: "Use of the Website",
    blocks: [
      { text: "You may use the Website for lawful purposes only." },
      { text: "You agree not to:" },
      {
        list: [
          "use the Website for any unlawful, fraudulent or unauthorised purpose;",
          "attempt to gain unauthorised access to the Website, its systems or databases;",
          "interfere with or disrupt the operation or security of the Website;",
          "introduce viruses, malware or other harmful material;",
          "copy, reproduce, distribute or exploit Website content without permission;",
          "impersonate another person or organisation;",
          "submit false, misleading or fraudulent information through any Website form;",
          "use automated systems to scrape, collect or reproduce Website content without our written permission; or",
          "use the Website in a manner that could damage the reputation, security or operation of Dakesliv.",
        ],
      },
      { text: "We reserve the right to restrict or terminate access to the Website where we reasonably believe that these Terms have been breached." },
    ],
  },
  {
    heading: "Website information",
    blocks: [
      { text: "We make reasonable efforts to ensure that information published on the Website is accurate and up to date." },
      { text: "However, information on the Website may change from time to time, including service descriptions, prices, availability, photographs, packages, personnel, locations, suppliers, promotions and other operational information." },
      { text: "Website information is provided for general information and does not, by itself, constitute a binding offer to provide a particular service." },
      { text: "A service becomes binding on Dakesliv only when the relevant booking, quotation, proposal, agreement, work order, invoice or other applicable document has been accepted and, where required, payment or deposit has been received." },
    ],
  },
  {
    heading: "Services and bookings",
    blocks: [
      { text: "Dakesliv may provide services directly or coordinate services through approved employees, contractors, professionals, vendors, suppliers or other third parties." },
      { text: "Depending on the service, a client may be required to provide accurate contact information, service date and time, location information, number of guests or persons involved, event or project requirements, technical specifications, access requirements, identification where legally required, and other information reasonably required to provide the service." },
      { text: "Clients are responsible for ensuring that information supplied to Dakesliv is complete and accurate." },
      { text: "Where a service requires a quotation, proposal, deposit or advance payment, the service may not be confirmed until the applicable requirements have been satisfied." },
    ],
  },
  {
    heading: "Quotations and pricing",
    blocks: [
      { text: "Unless expressly stated otherwise, prices displayed on the Website are indicative and may not constitute a final quotation." },
      { text: "A final price may depend on the scope of work, location, number of people, duration, materials, equipment, travel, third-party supplier costs, taxes, permits and special requirements." },
      { text: "A quotation issued by Dakesliv will normally specify its validity period and any applicable payment requirements." },
      { text: "A quotation does not constitute acceptance of a booking unless expressly stated otherwise." },
      { text: "Dakesliv reserves the right to correct pricing or other obvious errors on the Website." },
    ],
  },
  {
    heading: "Payments",
    blocks: [
      { text: "Payment terms will depend on the service and will be communicated to the client before or at the time of booking or contracting." },
      { text: "Where an advance payment or deposit is required, the booking, service date, procurement of materials or engagement of suppliers may not be secured until the required payment has been received." },
      { text: "Unless otherwise agreed in writing:" },
      {
        list: [
          "all payments must be made through payment methods authorised by Dakesliv;",
          "clients must retain proof of payment;",
          "payment obligations remain the responsibility of the contracting client; and",
          "additional services or changes requested after confirmation may result in additional charges.",
        ],
      },
      { text: "Dakesliv does not accept responsibility for payments made to unauthorised persons or accounts. Clients should verify payment instructions with Dakesliv before making significant payments." },
    ],
  },
  {
    heading: "Cancellations, rescheduling and refunds",
    blocks: [
      { text: "Cancellation, rescheduling and refund conditions may differ depending on the service." },
      { text: "This is because certain services may involve advance commitments to employees, contractors, venues, suppliers, equipment providers, travel arrangements, materials or other third parties." },
      { text: "The applicable cancellation and refund terms will therefore be communicated in the relevant quotation, booking confirmation, service agreement, work order or other contractual document." },
      { text: "Where no separate cancellation terms have been provided, Dakesliv will deal with cancellation requests reasonably and in accordance with applicable Kenyan law." },
      { text: "Where a refund is approved, any non-refundable third-party costs already incurred on behalf of the client may be deducted where legally permissible and where the client has been informed of such costs." },
    ],
  },
  {
    heading: "Client responsibilities",
    blocks: [
      { text: "Clients are responsible for providing accurate information, communicating requirements clearly, complying with payment terms, providing reasonable access to locations, obtaining permissions that are specifically the client's responsibility, ensuring information supplied does not infringe another person's rights, treating Dakesliv personnel and suppliers respectfully, complying with applicable laws and safety requirements, and notifying Dakesliv promptly of material changes." },
      { text: "A client's failure to provide necessary information, access, approvals or payments may affect Dakesliv's ability to deliver the agreed service." },
    ],
  },
  {
    heading: "Third-party suppliers and service providers",
    blocks: [
      { text: "Dakesliv may engage independent suppliers, contractors, professionals, vendors and other third parties to support delivery of its services." },
      { text: "This may include caterers, chefs, decorators, florists, DJs, MCs, photographers, videographers, equipment providers, transport providers, security personnel, cleaning providers, beauty and grooming professionals, technology professionals, hosting or software providers, and other specialist service providers." },
      { text: "Where Dakesliv coordinates third-party services as part of a client's booking, Dakesliv will use reasonable care in selecting and coordinating appropriate providers." },
      { text: "The particular responsibilities of Dakesliv and the relevant supplier will depend on the applicable client agreement, quotation or work order." },
    ],
  },
  {
    heading: "Catering and events",
    blocks: [
      { text: "Dakesliv Catering & Events Management may provide or coordinate catering, event planning, décor, flowers, entertainment, photography, videography, furniture, tents, lighting, sound, security, cleaning, transport and related event services." },
      { text: "Final arrangements depend on the agreed event brief. Guest numbers may affect pricing. Changes to menus, guest numbers, venue, timing or services may affect the final price. Venue restrictions may affect service delivery. Suppliers may be subject to availability. Certain services may require advance booking. Event arrangements may be affected by circumstances outside Dakesliv's reasonable control." },
      { text: "Specific event terms will be stated in the relevant event proposal, quotation, agreement or work order." },
    ],
  },
  {
    heading: "Grooming & Wellness services",
    blocks: [
      { text: "Dakesliv Grooming & Wellness may provide mobile and other grooming and wellness-related services through qualified or appropriately engaged professionals." },
      { text: "Services may include hairdressing, braiding, barbering, makeup, nails, bridal grooming, beauty services and corporate or group grooming packages." },
      { text: "Clients must disclose relevant information that may reasonably affect the safe provision of a service, including known allergies or sensitivities where applicable." },
      { text: "Dakesliv does not provide medical diagnosis or treatment through its ordinary grooming and wellness services." },
    ],
  },
  {
    heading: "Security services",
    blocks: [
      { text: "Dakesliv Security Solutions may provide security-related services subject to applicable Kenyan laws, licences, approvals and operational requirements." },
      { text: "Specific security services will be governed by a separate agreement setting out scope, personnel requirements, working hours, location, responsibilities, fees, client obligations and other relevant conditions." },
      { text: "Nothing on the Website should be interpreted as guaranteeing a particular security outcome." },
    ],
  },
  {
    heading: "Digital, app and website development services",
    blocks: [
      { text: "Dakesliv Digital may provide website design and development, mobile and web application development, software-related services, digital solutions, maintenance and support, technical consultation and other technology services." },
      { text: "Specific digital projects will normally be governed by a written proposal, statement of work, development agreement or work order." },
      { text: "Such documents may specify project scope, deliverables, milestones, development timelines, client responsibilities, intellectual property ownership, hosting, maintenance, support, third-party software, licences and change-request procedures." },
      { text: "Unless expressly agreed otherwise, additional work outside the agreed scope may attract additional charges." },
    ],
  },
  {
    heading: "Dakesliv Foundation",
    blocks: [
      { text: "Dakesliv Foundation is the charitable and community-support initiative associated with Dakesliv." },
      { text: "The Foundation's activities may include support for children and communities through education support, school supplies, mentorship, feeding programmes and other community projects." },
      { text: "Any donation, fundraising campaign or charitable initiative may be subject to separate terms and applicable legal requirements." },
      { text: "Dakesliv may change, suspend or discontinue a particular Foundation initiative where circumstances require." },
    ],
  },
  {
    heading: "Intellectual property",
    blocks: [
      { text: "Unless otherwise stated, all intellectual property appearing on or forming part of the Website belongs to Dakesliv Group Ltd or is used by Dakesliv with appropriate permission." },
      { text: "This includes the Dakesliv name and logo, business division names and logos, text, photographs, graphics, videos, designs, layouts, documents, trademarks, service descriptions, software, website design and other original materials." },
      { text: "You may access and view the Website for personal or legitimate business purposes." },
      { text: "You may not reproduce, modify, distribute, publish, sell, licence, commercially exploit or otherwise use Dakesliv intellectual property without prior written permission, except where permitted by applicable law." },
    ],
  },
  {
    heading: "Client materials",
    blocks: [
      { text: "Where a client provides Dakesliv with photographs, logos, text, documents, designs, branding, personal information or other materials, the client confirms that they have the necessary rights and permissions to provide those materials to Dakesliv." },
      { text: "The client grants Dakesliv the permission reasonably necessary to use the Client Materials for the purpose of providing the contracted service." },
    ],
  },
  {
    heading: "Portfolio and marketing use",
    blocks: [
      { text: "Where appropriate, Dakesliv may wish to display photographs, videos or descriptions of completed projects in its portfolio, social media or marketing materials." },
      { text: "Dakesliv will seek appropriate consent where required, particularly where identifiable individuals, private events or personal information are involved." },
    ],
  },
  {
    heading: "Personal data and privacy",
    blocks: [
      { text: "Dakesliv may collect and process personal information when you visit the Website, submit an enquiry, request a quotation, make a booking, make a payment, communicate with Dakesliv or otherwise interact with the Company." },
      { text: "Dakesliv will process personal data in accordance with applicable Kenyan data protection laws and its Privacy Policy." },
      { text: "The Dakesliv Privacy Policy forms part of the Website's legal framework and explains how personal information is collected, used, stored and handled." },
    ],
  },
  {
    heading: "Communications",
    blocks: [
      { text: "By submitting your contact information through the Website, you may be contacted by Dakesliv regarding enquiries, quotations, bookings, projects, payments, customer support, service updates or other matters directly connected to your relationship with Dakesliv." },
      { text: "Where required by law, marketing communications will be subject to appropriate consent and/or opt-out mechanisms." },
    ],
  },
  {
    heading: "Website security",
    blocks: [
      { text: "We take reasonable steps to maintain the security and availability of the Website." },
      { text: "However, no website or online transmission can be guaranteed to be completely secure or continuously available." },
    ],
  },
  {
    heading: "Third-party websites and links",
    blocks: [
      { text: "The Website may contain links to third-party websites, platforms or services." },
      { text: "Dakesliv does not necessarily control or endorse third-party websites and is not responsible for their content, availability, security, privacy practices, terms or products and services." },
    ],
  },
  {
    heading: "Disclaimer",
    blocks: [
      { text: "To the extent permitted by law, the Website and its content are provided on an \"as available\" basis." },
      { text: "Dakesliv does not guarantee that the Website will always be available, error-free, complete or current, or free from viruses or other harmful components." },
      { text: "Nothing in these Terms excludes statutory rights or protections that cannot lawfully be excluded." },
    ],
  },
  {
    heading: "Limitation of liability",
    blocks: [
      { text: "To the maximum extent permitted by applicable law, Dakesliv will not be liable for losses arising solely from events beyond its reasonable control, inaccurate information supplied by a client, unauthorised use of the Website, failure of third-party websites or platforms, delays caused by third parties, circumstances outside Dakesliv's reasonable control, or a client's failure to comply with agreed requirements." },
      { text: "Nothing in these Terms excludes or limits liability where doing so would be unlawful or limits statutory consumer rights that cannot legally be excluded." },
    ],
  },
  {
    heading: "Force majeure",
    blocks: [
      { text: "Dakesliv will not be responsible for delay, interruption or failure to perform its obligations to the extent caused by circumstances beyond its reasonable control, including natural disasters, extreme weather, fire, flood, epidemic or pandemic, government action, civil unrest, strikes, power or telecommunications failures, major technology failures, transport disruption, security incidents, supplier failure or other circumstances that could not reasonably have been prevented or controlled." },
    ],
  },
  {
    heading: "Confidentiality",
    blocks: [
      { text: "Dakesliv may receive confidential business, personal, financial, technical or project information from clients." },
      { text: "Dakesliv will take reasonable steps to keep confidential information confidential and will use such information only for legitimate business or contractual purposes, subject to lawful disclosure requirements and necessary disclosures to authorised advisers or service providers." },
    ],
  },
  {
    heading: "Complaints and customer support",
    blocks: [
      { text: "Dakesliv is committed to addressing customer concerns fairly and promptly." },
      { text: "If you have a complaint, please contact Dakesliv using the contact information published on the Website. Where possible, provide your full name, booking or project reference, date of service, relevant division, details of the concern and the resolution you are seeking." },
    ],
  },
  {
    heading: "Changes to these Terms",
    blocks: [
      { text: "Dakesliv may update these Terms from time to time." },
      { text: "Updated Terms will be published on the Website with a revised \"Last Updated\" date." },
    ],
  },
  {
    heading: "Termination of Website access",
    blocks: [
      { text: "Dakesliv may suspend or terminate access to the Website where reasonably necessary, including where these Terms are breached, unlawful activity is suspected, security is threatened, the Website is being misused, or maintenance or technical circumstances require suspension." },
    ],
  },
  {
    heading: "Governing law",
    blocks: [
      { text: "These Terms are governed by and interpreted in accordance with the laws of the Republic of Kenya." },
      { text: "Subject to mandatory consumer rights, disputes relating to these Terms or use of the Website shall be subject to the jurisdiction of the courts of Kenya." },
    ],
  },
  {
    heading: "Severability",
    blocks: [
      { text: "If any provision of these Terms is found to be invalid, unlawful or unenforceable, that provision shall be interpreted or modified to the extent necessary to make it lawful and enforceable where possible. The remaining provisions will continue in full force and effect." },
    ],
  },
  {
    heading: "No waiver",
    blocks: [
      { text: "Failure by Dakesliv to enforce any provision of these Terms does not constitute a waiver of its right to enforce that provision in the future." },
    ],
  },
  {
    heading: "Entire agreement",
    blocks: [
      { text: "These Website Terms govern general use of the Website." },
      { text: "For a particular service, additional documents may apply, including quotations, booking confirmations, service agreements, client services agreements, work orders, project proposals, supplier agreements, cancellation policies and payment terms." },
      { text: "Where there is a conflict between these Website Terms and a specific written agreement relating to a particular service, the specific agreement will generally take precedence for that service." },
    ],
  },
  {
    heading: "Contact Dakesliv",
    blocks: [
      { text: "Dakesliv Group Ltd" },
      { text: "P.O. Box 104566 – 00100, Nairobi, Kenya" },
      { text: "Email: dakeslivgroup@gmail.com" },
      { text: "Telephone: +254 18 2278161" },
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Website Terms & Conditions"
      effectiveDate="26 August 2026"
      lastUpdated="26 August 2026"
      intro={[
        {
          text: "Welcome to the website of Dakesliv Group Ltd (\"Dakesliv\", \"we\", \"us\", \"our\" or \"the Company\").",
        },
        {
          text: "These Website Terms & Conditions (\"Terms\") govern your access to and use of the Dakesliv Group Ltd website, including any pages, forms, features, content and services made available through the website (collectively, the \"Website\").",
        },
        {
          text: "By accessing or using the Website, you acknowledge that you have read, understood and agreed to be bound by these Terms. If you do not agree with these Terms, please do not use the Website.",
        },
        {
          text: "These Terms apply to the Website generally. Individual Dakesliv services may be subject to additional terms, service agreements, quotations, work orders, booking conditions, supplier agreements or other contractual documents. Where additional terms apply to a particular service, those terms will form part of the agreement between Dakesliv and the relevant client.",
        },
      ]}
      sections={sections}
      closing={[
        {
          subheading: "Acknowledgement",
          text: "By using this Website, you acknowledge that you have read and understood these Terms & Conditions and agree to comply with them.",
        },
      ]}
    />
  );
}
