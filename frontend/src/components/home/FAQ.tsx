"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How do I schedule a visit for a property?",
    a: "You can book a visit by clicking the 'Contact Agent' button on any property page. Choose a time that works for you and confirm it directly via WhatsApp.",
  },
  {
    q: "Do you offer virtual property tours?",
    a: "Yes! Many of our listings include virtual tours. Look for the 'Virtual Tour' badge on property cards. You can view 360° photos and video walkthroughs.",
  },
  {
    q: "Are your listings up to date?",
    a: "All listings automatically expire after 30 days to ensure freshness. Agents must renew their listings, and we run periodic verification checks.",
  },
  {
    q: "What is the process of buying a home through your agency?",
    a: "Homify Kenya currently focuses on rentals. For buying, contact us directly and we'll connect you with our trusted partner estate agents.",
  },
  {
    q: "Can you help with mortgage or financing?",
    a: "We partner with select Kenyan banks and SACCOs. Reach out to our support team and we'll connect you with financing partners.",
  },
  {
    q: "Do I need an appointment to view a property?",
    a: "Most agents prefer appointments. Simply click WhatsApp on any listing to arrange a convenient viewing time directly.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <p className="section-label mb-2">## FAQ</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mb-8">
              Can&apos;t find what you&apos;re looking for? Our support team is happy to help.
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="font-semibold text-gray-900 mb-1">Still Have Questions?</p>
              <p className="text-gray-500 text-sm mb-4">Please connect with our support team. We&apos;re here to help.</p>
              <Link href="/contact" className="btn-outline text-sm inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right – accordion */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className={`text-sm font-semibold ${open === i ? "text-brand-500" : "text-gray-800"}`}>
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center">
                    {open === i
                      ? <Minus className="w-4 h-4 text-brand-500" />
                      : <Plus className="w-4 h-4 text-gray-500" />
                    }
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
