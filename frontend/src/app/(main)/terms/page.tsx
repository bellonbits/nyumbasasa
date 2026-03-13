import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Use" };

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Homify Kenya ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.

These terms apply to all users of the platform, including renters, agents, landlords, and visitors.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years old to create an account or post a listing on Homify Kenya. By using the platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding agreement.`,
  },
  {
    title: "3. Agent Listings",
    content: `Agents and landlords who post listings agree to:

• Provide accurate, up-to-date information about the property
• Only list properties they are legally authorized to rent out
• Not post duplicate, misleading, or fraudulent listings
• Respond to inquiries in a timely and professional manner
• Remove listings once a property has been rented

Listings that violate these terms may be removed without notice, and accounts may be suspended or terminated.`,
  },
  {
    title: "4. Renter Responsibilities",
    content: `Renters using our platform agree to:

• Use contact information obtained through the platform solely for rental inquiries
• Not harass, threaten, or abuse agents or landlords
• Conduct independent due diligence before signing any rental agreement
• Not use the platform for any unlawful purpose

Homify Kenya is a marketplace and is not a party to any rental agreement between renters and landlords.`,
  },
  {
    title: "5. Prohibited Activities",
    content: `You may not use the platform to:

• Post false, misleading, or fraudulent property information
• Scrape or harvest data from the platform
• Send spam, unsolicited communications, or promotional messages
• Impersonate another person or entity
• Interfere with the platform's security or availability
• Attempt to gain unauthorized access to any part of the platform`,
  },
  {
    title: "6. Intellectual Property",
    content: `All content on the platform, including text, graphics, logos, and software, is the property of Homify Kenya Ltd or its content suppliers and is protected by applicable intellectual property laws.

You are granted a limited, non-exclusive license to use the platform for its intended purpose. You may not copy, reproduce, distribute, or create derivative works without our prior written consent.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    content: `The platform is provided on an "as is" and "as available" basis. Homify Kenya makes no representations or warranties of any kind, express or implied, including:

• The accuracy or completeness of listing information
• The reliability, availability, or suitability of properties listed
• That the platform will be uninterrupted, secure, or error-free

We strongly encourage renters to visit properties in person before making any payment.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the fullest extent permitted by Kenyan law, Homify Kenya shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to rental fraud, loss of data, or unauthorized access.

Our total liability for any claims arising from these terms shall not exceed KES 10,000.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate your account at any time, with or without cause, and with or without notice. Upon termination, your right to use the platform will immediately cease.

You may delete your account at any time by contacting support@homifykenya.co.ke`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We reserve the right to modify these Terms of Use at any time. We will provide notice of material changes by updating the "Last updated" date or by sending an email to registered users. Your continued use of the platform after changes take effect constitutes acceptance of the updated terms.`,
  },
  {
    title: "12. Contact",
    content: `For questions about these Terms of Use, please contact:

Homify Kenya Ltd
Email: legal@homifykenya.co.ke
Phone: +254 700 000 000`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Use</h1>
        <p className="text-gray-400 text-sm">Last updated: March 1, 2026</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8">
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Important:</strong> Homify Kenya is a marketplace — we are not a party to any rental agreement. Always visit a property in person and verify ownership before making any payment. Report suspicious listings to{" "}
          <a href="mailto:support@homifykenya.co.ke" className="underline">support@homifykenya.co.ke</a>.
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

      <div className="mt-10 p-5 bg-gray-50 rounded-2xl text-center">
        <p className="text-sm text-gray-500">
          By using Homify Kenya, you agree to these terms and our{" "}
          <Link href="/privacy" className="text-brand-500 hover:text-brand-600 font-medium">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
