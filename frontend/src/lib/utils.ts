import { type ClassValue, clsx } from "clsx";
import type { HouseType } from "@/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function houseTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    bedsitter:     "Bedsitter",
    studio:        "Studio",
    one_bedroom:   "1 Bedroom",
    two_bedroom:   "2 Bedrooms",
    three_bedroom: "3 Bedrooms",
  };
  return labels[type.toLowerCase()] ?? type;
}

export function buildWhatsAppLink(phone: string, propertyTitle: string): string {
  const clean = phone.replace(/\D/g, "");
  const intl = clean.startsWith("0") ? `254${clean.slice(1)}` : clean;
  const msg = encodeURIComponent(
    `Hello, I'm interested in the property: ${propertyTitle}. Is it still available?`
  );
  return `https://wa.me/${intl}?text=${msg}`;
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

/** Returns the primary image URL or a placeholder */
export function getPrimaryImage(images: { url: string; isPrimary: boolean }[]): string {
  const primary = images.find((i) => i.isPrimary);
  return primary?.url ?? images[0]?.url ?? "/images/placeholder-house.jpg";
}

export const BUDGET_RANGES = [
  { label: "Under KES 5,000",   min: 0,     max: 5000  },
  { label: "KES 5,000 – 10,000", min: 5000,  max: 10000 },
  { label: "KES 10,000 – 15,000",min: 10000, max: 15000 },
  { label: "KES 15,000 – 20,000",min: 15000, max: 20000 },
  { label: "KES 20,000 – 30,000",min: 20000, max: 30000 },
  { label: "Above KES 30,000",   min: 30000, max: 999999},
];

export const KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
  "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

export const HOUSE_TYPES: { value: HouseType; label: string }[] = [
  { value: "bedsitter",    label: "Bedsitter"  },
  { value: "studio",       label: "Studio"     },
  { value: "one_bedroom",  label: "1 Bedroom"  },
  { value: "two_bedroom",  label: "2 Bedrooms" },
  { value: "three_bedroom",label: "3 Bedrooms" },
];
