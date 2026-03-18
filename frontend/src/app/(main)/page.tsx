import type { Metadata } from "next";
import HeroSection     from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks      from "@/components/home/HowItWorks";
import AgentCTA        from "@/components/home/AgentCTA";
import PopularCounties from "@/components/home/PopularCounties";
import Testimonials    from "@/components/home/Testimonials";
import BlogTeaser      from "@/components/home/BlogTeaser";

export const metadata: Metadata = {
  title: "Nyumbasasa – Find Affordable Homes in Kenya",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <HowItWorks />
      <AgentCTA />
      <PopularCounties />
      <Testimonials />
      <BlogTeaser />
    </>
  );
}
