import Link from "next/link";

const POSTS = [
  { slug: "rental-tips-nairobi",      date: "Mar 1",  readTime: "5 min read",  title: "Top Tips for Renting in Nairobi: What Every Tenant Should Know" },
  { slug: "bedsitter-vs-studio",      date: "Feb 22", readTime: "4 min read",  title: "Bedsitter vs Studio: Which Is Right for You in 2026?" },
  { slug: "counties-affordable-rent", date: "Feb 15", readTime: "7 min read",  title: "The Most Affordable Counties for Renters Outside Nairobi" },
  { slug: "agent-red-flags",          date: "Feb 8",  readTime: "6 min read",  title: "Real Estate Red Flags: How to Spot a Dodgy Landlord or Agent" },
];

export default function BlogTeaser() {
  return (
    <section className="py-16 bg-[#F5F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Real Estate Blog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group block bg-white rounded-2xl p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-600 transition-colors">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
