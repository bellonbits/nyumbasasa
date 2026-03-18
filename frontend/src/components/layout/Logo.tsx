// Logo component — clips the house icon from logo.png and renders text
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** On dark backgrounds, invert icon + render white text */
  invert?: boolean;
}

const SIZES = {
  sm: { h: 36, iconW: 44 },
  md: { h: 44, iconW: 52 },
  lg: { h: 56, iconW: 66 },
};

export default function Logo({ className, size = "md", invert = false }: LogoProps) {
  const { h, iconW } = SIZES[size];

  // The source image is ~650×200px. House icon occupies ~x:0–250 (38% of width).
  // At display height h, full natural width = h * 3.25; icon width = h * 1.25
  const imgNaturalW = h * 3.25;

  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0 select-none", className)}>
      {/* House icon — clipped from the left of logo.png */}
      <div style={{ overflow: "hidden", width: `${iconW}px`, height: `${h}px`, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Nyumbasasa"
          style={{
            height: `${h}px`,
            width: `${imgNaturalW}px`,
            maxWidth: "none",
            filter: invert ? "brightness(0) invert(1)" : "none",
          }}
        />
      </div>

      {/* Wordmark */}
      <div style={{ lineHeight: 1 }}>
        <span
          style={{
            fontWeight: 800,
            fontSize: `${h * 0.45}px`,
            color: invert ? "#ffffff" : "#0057ff",
            letterSpacing: "-0.03em",
            display: "block",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          nyumbasasa
        </span>
        <span
          style={{
            fontSize: `${h * 0.23}px`,
            color: invert ? "rgba(255,255,255,0.55)" : "#707070",
            display: "block",
            marginTop: "2px",
            letterSpacing: "0.01em",
          }}
        >
          Kenya
        </span>
      </div>
    </Link>
  );
}
