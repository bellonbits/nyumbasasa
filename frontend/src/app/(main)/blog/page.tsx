import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Real Estate Blog" };

const CATEGORIES = ["All", "Renter Tips", "Market Insights", "Agent Guide", "Nairobi", "Mombasa"];

const POSTS = [
  {
    slug: "rental-tips-nairobi",
    category: "Renter Tips",
    date: "March 1, 2026",
    readTime: "5 min read",
    title: "Top Tips for Renting in Nairobi: What Every Tenant Should Know",
    excerpt: "Moving to Nairobi? Here's everything you need to know about finding affordable, verified rentals — from Kasarani to Karen.",
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&q=80",
    author: { name: "Amina Kariuki", avatar: "AK" },
  },
  {
    slug: "bedsitter-vs-studio",
    category: "Renter Tips",
    date: "February 22, 2026",
    readTime: "4 min read",
    title: "Bedsitter vs Studio: Which Is Right for You in 2026?",
    excerpt: "Both offer affordable single-person living, but there are key differences in space, cost, and lifestyle. We break it all down.",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80",
    author: { name: "Brian Otieno", avatar: "BO" },
  },
  {
    slug: "counties-affordable-rent",
    category: "Market Insights",
    date: "February 15, 2026",
    readTime: "7 min read",
    title: "The Most Affordable Counties for Renters Outside Nairobi",
    excerpt: "Nairobi rents rising? Discover which Kenyan counties offer great value for renters — with real listing data from our platform.",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
    author: { name: "Zara Odhiambo", avatar: "ZO" },
  },
  {
    slug: "agent-red-flags",
    category: "Renter Tips",
    date: "February 8, 2026",
    readTime: "6 min read",
    title: "Real Estate Red Flags: How to Spot a Dodgy Landlord or Agent",
    excerpt: "Rental fraud is on the rise in Kenya. Here are the warning signs every renter should know before paying a deposit.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    author: { name: "Kevin Nganga", avatar: "KN" },
  },
  {
    slug: "negotiate-rent-kenya",
    category: "Renter Tips",
    date: "January 28, 2026",
    readTime: "5 min read",
    title: "How to Negotiate Your Rent in Kenya (And Actually Win)",
    excerpt: "Most tenants don't know they can negotiate rent. We share proven tactics that work with landlords and agents in the current market.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    author: { name: "Amina Kariuki", avatar: "AK" },
  },
  {
    slug: "mombasa-rental-market",
    category: "Mombasa",
    date: "January 15, 2026",
    readTime: "6 min read",
    title: "Mombasa Rental Market in 2026: What Renters Need to Know",
    excerpt: "Mombasa's rental market is booming. From Nyali to Shanzu, discover the best areas and average prices for 2026.",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
    author: { name: "Zara Odhiambo", avatar: "ZO" },
  },
  {
    slug: "agent-listing-guide",
    category: "Agent Guide",
    date: "January 5, 2026",
    readTime: "8 min read",
    title: "How to Create Listings That Get 5x More Views on Homify Kenya",
    excerpt: "A great listing photo and the right title can make or break your response rate. Here's the agent's playbook for 2026.",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    author: { name: "Brian Otieno", avatar: "BO" },
  },
  {
    slug: "nairobi-estate-guide",
    category: "Nairobi",
    date: "December 18, 2025",
    readTime: "10 min read",
    title: "The Ultimate Guide to Nairobi's Neighbourhoods for Renters",
    excerpt: "From Westlands to Rongai, every Nairobi estate explained — with average rent ranges, commute tips, and lifestyle notes.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    author: { name: "Kevin Nganga", avatar: "KN" },
  },
];

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Real Estate Blog</h1>
        <p className="text-gray-400">Tips, market insights, and guides for renters and agents in Kenya.</p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button key={cat}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border
              ${cat === "All" ? "bg-gray-900 text-white border-gray-900" : "text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured post */}
      <Link href={`/blog/${featured.slug}`}
        className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow mb-10">
        <div className="flex flex-col lg:flex-row">
          <div className="relative lg:w-1/2 h-60 lg:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
          </div>
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
              <span className="bg-brand-100 text-brand-700 font-semibold px-2.5 py-0.5 rounded-full">{featured.category}</span>
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
              {featured.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                {featured.author.avatar}
              </div>
              <span className="text-sm text-gray-600">{featured.author.name}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-brand-500 transition-colors" />
            </div>
          </div>
        </div>
      </Link>

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
            <div className="relative h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span className="bg-gray-100 text-gray-600 font-medium px-2.5 py-0.5 rounded-full">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-brand-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[9px] font-bold text-brand-700">
                  {post.author.avatar}
                </div>
                <span className="text-xs text-gray-500">{post.author.name}</span>
                <span className="text-xs text-gray-300 ml-auto">{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
