import { Search, MessageCircle, KeyRound, TrendingUp } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Search & Filter",
    description: "Use smart filters by county, budget, and house type. Browse across all 47 counties instantly.",
    color: "bg-brand-500",
  },
  {
    step: "02",
    icon: MessageCircle,
    title: "Chat via WhatsApp",
    description: "Connect directly with verified agents on WhatsApp — no sign-up needed to inquire.",
    color: "bg-blue-500",
  },
  {
    step: "03",
    icon: KeyRound,
    title: "Move In",
    description: "Visit the property, agree on terms, and get your keys. Simple, transparent, no hidden fees.",
    color: "bg-amber-500",
  },
];

const STATS = [
  { value: "220K",  label: "Properties Listed", sub: "Since our founding"               },
  { value: "50K+",  label: "Tenants Helped",    sub: "Found their dream home"            },
  { value: "500+",  label: "Verified Agents",   sub: "Licensed professionals"            },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label mb-3 block">Simple Process</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Home in 3 Easy Steps
          </h2>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Homify Kenya makes renting simple, transparent, and accessible for every Kenyan.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-10 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-0.5 border-t-2 border-dashed border-gray-200" />

          {STEPS.map(({ step, icon: Icon, title, description, color }) => (
            <div key={step} className="group text-center relative">
              {/* Icon circle */}
              <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-9 h-9 text-white" />
              </div>
              <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Step {step}</span>
              <h3 className="font-heading text-lg font-bold text-gray-900 mt-1.5 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
            </div>
          ))}
        </div>

        {/* Dark stats banner */}
        <div className="relative overflow-hidden bg-gray-950 rounded-3xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-10 lg:p-14">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                <span className="text-brand-400 text-xs font-bold tracking-widest uppercase">About Us</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-white mb-4 leading-tight">
                Our Commitment Is Delivering<br />
                <span className="text-gradient">Quality Verified Listings</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                We are dedicated to superior service through verified listings, transparent pricing,
                sustainable practices, and direct communication between renters and landlords.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20"
              >
                More About Us <TrendingUp className="w-4 h-4" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 divide-y divide-white/10 border-t lg:border-t-0 lg:border-l border-white/10">
              {STATS.map(({ value, label, sub }) => (
                <div key={label} className="px-10 py-8 flex items-center gap-6">
                  <p className="font-heading text-4xl font-bold text-brand-400 flex-shrink-0">{value}</p>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
                    <p className="text-gray-500 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
