import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const POSTS = [
  { slug: "rental-tips-nairobi",      date: "Mar 1",  readTime: "5 min read", title: "Top Tips for Renting in Nairobi: What Every Tenant Should Know" },
  { slug: "bedsitter-vs-studio",      date: "Feb 22", readTime: "4 min read", title: "Bedsitter vs Studio: Which Is Right for You in 2026?" },
  { slug: "counties-affordable-rent", date: "Feb 15", readTime: "7 min read", title: "The Most Affordable Counties for Renters Outside Nairobi" },
  { slug: "agent-red-flags",          date: "Feb 8",  readTime: "6 min read", title: "Real Estate Red Flags: How to Spot a Dodgy Landlord or Agent" },
];

export default function BlogTeaser() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label mb-2 block">Our Blog</span>
            <h2 className="text-display-sm font-extrabold text-ink">Real Estate Insights</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-brand-600 border border-surface-border hover:border-brand-300 px-4 py-2 rounded-full transition-all"
          >
            All articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Post grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-2xl p-6 border border-surface-border hover:border-brand-200 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <BookOpen className="w-4 h-4 text-brand-500" />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2.5 text-xs text-ink-faint mb-3">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-surface-border" />
                <span>{post.readTime}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-brand-600 transition-colors">
                {post.title}
              </h3>

              {/* Read more */}
              <div className="flex items-center gap-1 text-xs font-semibold text-brand-500 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
