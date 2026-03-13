import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, post a listing, or contact an agent. This includes:

• Name, email address, and phone number
• Property listing details (address, photos, rent amount)
• Search preferences and saved listings
• Device and usage information (browser type, IP address, pages visited)
• Communications between you and agents or landlords`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Connect renters with agents and landlords
• Process transactions and send related notifications
• Send marketing communications (you may opt out at any time)
• Detect and prevent fraud or abuse
• Comply with legal obligations`,
  },
  {
    title: "3. Sharing of Information",
    content: `We do not sell your personal information. We share your information only:

• With agents or landlords when you make an inquiry
• With service providers who assist in our operations (hosting, analytics, payment processing)
• When required by law or to protect rights and safety
• In connection with a merger, sale, or acquisition of Homify Kenya`,
  },
  {
    title: "4. Data Storage & Security",
    content: `Your data is stored on secure servers located in Kenya and the European Union. We use industry-standard encryption (TLS/SSL) to protect data in transit and at rest. Passwords are hashed using Argon2, an industry-leading algorithm.

Despite our security measures, no transmission over the internet is 100% secure. We encourage users to use strong passwords and to contact us immediately if they suspect any breach.`,
  },
  {
    title: "5. Cookies",
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.`,
  },
  {
    title: "6. Your Rights",
    content: `Under Kenyan data protection law, you have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate data
• Request deletion of your account and personal data
• Withdraw consent to marketing communications
• Lodge a complaint with the Office of the Data Protection Commissioner (ODPC)

To exercise any of these rights, contact us at privacy@homifykenya.co.ke`,
  },
  {
    title: "7. Third-Party Links",
    content: `Our platform may contain links to third-party websites (e.g., WhatsApp, Google Maps). We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our services are not directed to children under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date below. We encourage you to review this policy periodically.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at:

Homify Kenya Ltd
Nairobi, Kenya
Email: privacy@homifykenya.co.ke
Phone: +254 700 000 000`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: March 1, 2026</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>Summary:</strong> Homify Kenya collects only the information needed to run our rental marketplace. We never sell your personal data. You can request deletion of your account at any time by emailing{" "}
          <a href="mailto:privacy@homifykenya.co.ke" className="underline">privacy@homifykenya.co.ke</a>.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map(({ title, content }) => (
          <div key={title} className="border-b border-gray-100 pb-8 last:border-0">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
