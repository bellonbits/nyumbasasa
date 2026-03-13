import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";

const AGENTS = [
  { name: "Grace Wanjiku",  agency: "Wanjiku Real Estate",    props: 453, rating: 5.0, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80" },
  { name: "David Mwangi",   agency: "Nairobi Homes Ltd",      props: 325, rating: 5.0, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" },
  { name: "Peter Ochieng",  agency: "Rift Valley Homes",      props: 289, rating: 5.0, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Akinyi Otieno",  agency: "Lakeside Properties",    props: 230, rating: 5.0, avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80" },
];

export default function AgentCTA() {
  return (
    <section className="py-16 bg-[#F5F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">

            {/* Left text */}
            <div className="lg:w-64 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sell with<br />top agents</h2>
              <p className="text-sm text-gray-500 mb-6">Skip the hustle and let the pros get things done</p>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-400 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-full transition-all">
                Top Agents <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Agent cards */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {AGENTS.map((agent) => (
                <div key={agent.name} className="border border-gray-100 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-3">
                    <Image src={agent.avatar} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-sm font-semibold text-gray-900">{agent.rating.toFixed(1)}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight mb-0.5">{agent.name}</p>
                  <p className="text-xs text-gray-400 mb-4">{agent.props} properties sold</p>
                  <button className="w-full border border-gray-200 hover:border-gray-400 text-gray-700 text-xs font-semibold py-2 rounded-full transition-all">
                    Contact
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
