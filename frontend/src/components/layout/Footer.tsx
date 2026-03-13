import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";

const COLS = [
  { title: "Menu", links: [
    { label: "About",         href: "/about"   },
    { label: "Bedsitters",    href: "/search?houseType=bedsitter"    },
    { label: "Studios",       href: "/search?houseType=studio"       },
    { label: "1 Bedroom",     href: "/search?houseType=one_bedroom"  },
    { label: "For Rent",      href: "/search"  },
  ]},
  { title: "Info", links: [
    { label: "Blog",               href: "/blog"       },
    { label: "Renters Guide",      href: "/guide"      },
    { label: "Agents Guide",       href: "/agents"     },
    { label: "Price Calculator",   href: "/calculator" },
    { label: "Mortgage Calculator",href: "/mortgage"   },
  ]},
  { title: "Legal", links: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of use",   href: "/terms"   },
  ]},
  { title: "Agents", links: [
    { label: "Top agents", href: "/agents"     },
    { label: "A–Z",        href: "/agents/all" },
  ]},
  { title: "Help", links: [
    { label: "Support",            href: "/support"   },
    { label: "Property valuation", href: "/valuation" },
    { label: "Legal support",      href: "/legal"     },
    { label: "Rent and sale",      href: "/search"    },
  ]},
];

const SOCIALS = [
  { icon: Facebook,  href: "#", label: "Facebook"  },
  { icon: Twitter,   href: "#", label: "Twitter"   },
  { icon: Linkedin,  href: "#", label: "LinkedIn"  },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Logo + contact */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="mb-6">
              <Logo size="md" />
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>+254 700 000 000</p>
              <p>hello@homifykenya.co.ke</p>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {COLS.map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Homify Kenya. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
