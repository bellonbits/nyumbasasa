import { Search, Phone, KeyRound } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Search & Filter",
    description: "Use our smart search to filter by county, budget, and house type across all 47 counties.",
    color: "bg-brand-50 text-brand-600",
  },
  {
    step: "02",
    icon: Phone,
    title: "Contact via WhatsApp",
    description: "Connect directly with verified agents via WhatsApp — no sign-up needed to inquire.",
    color: "bg-green-50 text-green-600",
  },
  {
    step: "03",
    icon: KeyRound,
    title: "Move In",
    description: "Visit the property, agree on terms, and get your keys. Simple, transparent, no hidden fees.",
    color: "bg-blue-50 text-blue-600",
  },
];

const STATS = [
  { value: "220K",  label: "Properties Listed", sub: "Since our founding" },
  { value: "50K+",  label: "Tenants Helped",    sub: "Found happiness & satisfaction" },
  { value: "200K+", label: "Agent Sign-ups",    sub: "Listing with the established platform" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-2">## How It Works</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Home in 3 Easy Steps
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Homify Kenya makes renting simple, transparent, and accessible for every Kenyan.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {STEPS.map(({ step, icon: Icon, title, description, color }, idx) => (
            <div key={step} className="relative">
              {idx < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-4rem)] h-0.5
                                border-t-2 border-dashed border-gray-200" />
              )}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                  <Icon className="w-9 h-9" />
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-widest">STEP {step}</span>
                <h3 className="font-heading text-lg font-bold text-gray-900 mt-1 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About / Stats banner */}
        <div className="bg-gray-900 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-10 lg:p-14">
              <p className="section-label text-brand-400 mb-3">## About Us</p>
              <h2 className="font-heading text-3xl font-bold text-white mb-4">
                Our Commitment Is To Deliver The Highest Quality Listings
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                We are dedicated to delivering superior craftsmanship through verified listings,
                energy-efficient designs, sustainable practices, and transparent communication
                between renters and landlords across Kenya.
              </p>
              <a href="/about"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white
                           text-sm font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all">
                More About Us →
              </a>
            </div>
            <div className="grid grid-cols-3 bg-brand-500/10 lg:bg-transparent">
              {STATS.map(({ value, label, sub }) => (
                <div key={label} className="p-8 flex flex-col items-center justify-center text-center border-l border-white/10">
                  <p className="font-heading text-3xl font-bold text-brand-400 mb-1">{value}</p>
                  <p className="text-white text-sm font-medium mb-1">{label}</p>
                  <p className="text-gray-500 text-xs leading-tight">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
