import type { Metadata } from "next";
import HeroSection     from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import AgentCTA        from "@/components/home/AgentCTA";
import YouMightLike    from "@/components/home/YouMightLike";
import BlogTeaser      from "@/components/home/BlogTeaser";
import PopularCounties from "@/components/home/PopularCounties";

export const metadata: Metadata = {
  title: "Homify Kenya – Find Affordable Homes in Kenya",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <AgentCTA />
      <YouMightLike />
      <BlogTeaser />
      <PopularCounties />
    </>
  );
}
