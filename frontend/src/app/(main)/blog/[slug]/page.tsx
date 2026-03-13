import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

const POSTS: Record<string, {
  title: string; date: string; readTime: string; category: string;
  author: { name: string; role: string; avatar: string };
  image: string; content: string;
}> = {
  "rental-tips-nairobi": {
    title: "Top Tips for Renting in Nairobi: What Every Tenant Should Know",
    date: "March 1, 2026", readTime: "5 min read", category: "Renter Tips",
    author: { name: "Amina Kariuki", role: "Head of Product", avatar: "AK" },
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1200&q=85",
    content: `Moving to Nairobi can be both exciting and overwhelming. With thousands of listings across dozens of estates, finding the right home at the right price requires strategy.

**1. Know Your Budget Before You Start**

The first rule of renting in Nairobi is to know exactly how much you can afford — not just for rent, but for deposit (usually 1–3 months' rent) and utilities. A common mistake is finding a perfect apartment and realizing the deposit is out of reach.

**2. Understand the Neighbourhoods**

Nairobi is a city of micro-neighborhoods. Westlands and Kilimani command premium prices but offer proximity to offices and entertainment. Kasarani, Ruaka, and Rongai offer significantly cheaper rents with good transport links. Research commute times before signing any lease.

**3. Always Visit in Person**

Never pay a deposit on a property you haven't physically visited. Photos can be misleading — always inspect plumbing, electrical, water pressure, and security before committing.

**4. Use Verified Platforms**

Using a platform like Homify Kenya means you're browsing listings that have been checked for accuracy. Every listing on our platform is reviewed before going live. This drastically reduces your exposure to rental fraud.

**5. Negotiate**

Most renters don't realize that rent is often negotiable — especially for longer leases. Don't be afraid to ask for a lower price, a free month, or for the landlord to include utility connections.

**6. Read the Lease Carefully**

Before signing, review the lease for clauses about rent increases, maintenance responsibilities, and break terms. If something isn't clear, ask a lawyer or a housing advisor.`,
  },
  "bedsitter-vs-studio": {
    title: "Bedsitter vs Studio: Which Is Right for You in 2026?",
    date: "February 22, 2026", readTime: "4 min read", category: "Renter Tips",
    author: { name: "Brian Otieno", role: "CEO & Co-founder", avatar: "BO" },
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=85",
    content: `Both bedsitters and studios offer affordable single-person living across Kenyan cities, but they are meaningfully different. Understanding the distinction can save you money and frustration.

**What is a Bedsitter?**

A bedsitter is a single room that combines a bedroom and living area, with a shared or private bathroom and no separate kitchen. The cooking area (if any) is typically in the main room. Bedsitters typically range from KES 5,000–15,000/month in most cities.

**What is a Studio?**

A studio apartment is a self-contained unit with a separate bathroom and a defined (though open-plan) kitchen area. Studios are larger than bedsitters, better equipped, and more expensive — typically KES 12,000–25,000/month.

**Which Should You Choose?**

Choose a **bedsitter** if: you're on a tight budget, you eat out most of the time, and you don't mind compact living.

Choose a **studio** if: you prefer cooking at home, need a bit more space, or want a modern, self-contained setup.

In most Kenyan cities, the price difference between a bedsitter and a studio is about KES 4,000–8,000/month — often worth the upgrade for the added privacy and kitchen access.`,
  },
};

// Generate fallback for any slug not in our data
function getPost(slug: string) {
  return POSTS[slug] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Blog Post" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  // Render markdown-like content (bold with **)
  const renderContent = (text: string) => {
    return text.split("\n\n").map((para, i) => {
      if (para.startsWith("**") && para.endsWith("**")) {
        return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{para.slice(2, -2)}</h3>;
      }
      // Handle inline bold
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-gray-600 leading-relaxed mb-4">
          {parts.map((part, j) =>
            part.startsWith("**") ? <strong key={j} className="text-gray-900">{part.slice(2, -2)}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Posts
      </Link>

      {/* Category */}
      <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
        {post.category}
      </span>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-5 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
            {post.author.avatar}
          </div>
          <div>
            <p className="text-gray-700 font-medium text-sm">{post.author.name}</p>
            <p className="text-gray-400 text-xs">{post.author.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> {post.date}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {post.readTime}
        </div>
        <button className="ml-auto flex items-center gap-1.5 hover:text-gray-600 transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Hero image */}
      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        {renderContent(post.content)}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-[#F5F3EE] rounded-2xl p-8 text-center">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Ready to find your next home?</h3>
        <p className="text-gray-500 text-sm mb-5">Browse thousands of verified rentals across all 47 Kenyan counties.</p>
        <Link href="/search"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm">
          Browse Listings
        </Link>
      </div>

      {/* Back to blog */}
      <div className="mt-8 text-center">
        <Link href="/blog" className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors">
          ← More Articles
        </Link>
      </div>
    </div>
  );
}
