// Logo component — clips the house icon from logo.png and renders black text
// The PNG has a lime/green house icon on the left (~38% of width) and light-gray text on the right
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** On dark backgrounds, invert icon to white */
  invert?: boolean;
}

const SIZES = {
  sm: { h: 36, iconW: 44 },
  md: { h: 44, iconW: 52 },
  lg: { h: 56, iconW: 66 },
};

export default function Logo({ className, size = "md", invert = false }: LogoProps) {
  const { h, iconW } = SIZES[size];

  // The source image is ~650×200px. The house icon occupies ~x:0–250, so 38% of width.
  // At display height h, the full image natural width = h * (650/200) = h * 3.25
  // The icon portion visible width = h * (250/200) = h * 1.25
  const imgNaturalW = h * 3.25;

  return (
    <Link href="/" className={cn("flex items-center gap-2 flex-shrink-0", className)}>
      {/* House icon — clipped from the left of logo.png */}
      <div style={{ overflow: "hidden", width: `${iconW}px`, height: `${h}px`, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Homify Kenya"
          style={{
            height: `${h}px`,
            width: `${imgNaturalW}px`,
            maxWidth: "none",
            filter: invert ? "brightness(0) invert(1)" : "none",
          }}
        />
      </div>

      {/* Text — always sharp black (or white if invert) */}
      <div style={{ lineHeight: 1 }}>
        <span style={{
          fontWeight: 700,
          fontSize: `${h * 0.45}px`,
          color: invert ? "#fff" : "#111111",
          letterSpacing: "-0.02em",
          display: "block",
        }}>
          homify
        </span>
        <span style={{
          fontSize: `${h * 0.24}px`,
          color: invert ? "rgba(255,255,255,0.7)" : "#555555",
          display: "block",
          marginTop: "2px",
        }}>
          Kenya
        </span>
      </div>
    </Link>
  );
}
