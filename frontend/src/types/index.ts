// ─── Enums ────────────────────────────────────────────────────────────────────

export type HouseType = "bedsitter" | "studio" | "one_bedroom" | "two_bedroom" | "three_bedroom";
export type ListingStatus = "active" | "archived" | "pending" | "rejected";
export type UserRole = "admin" | "agent" | "user";

// ─── Location ─────────────────────────────────────────────────────────────────

export interface County {
  id: string;
  name: string;
  slug: string;
  region: string;
  imageUrl?: string;
  listingCount?: number;
}

export interface Town {
  id: string;
  name: string;
  slug: string;
  countyId: string;
  county?: County;
}

export interface Estate {
  id: string;
  name: string;
  slug: string;
  townId: string;
  town?: Town;
}

// ─── User / Agent ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Agent extends User {
  agencyName?: string;
  bio?: string;
  verified: boolean;
  listingCount?: number;
  whatsapp?: string;
}

// ─── Property / Listing ───────────────────────────────────────────────────────

export interface PropertyImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  rent: number;
  deposit: number;
  houseType: HouseType;
  status: ListingStatus;
  isVerified: boolean;
  isBoosted: boolean;
  // location
  county: County;
  town: Town;
  estate?: Estate;
  address?: string;
  latitude?: number;
  longitude?: number;
  // media
  images: PropertyImage[];
  // relations
  agent: Agent;
  amenities: Amenity[];
  // meta
  viewCount: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Search / Filters ─────────────────────────────────────────────────────────

export interface SearchFilters {
  county?: string;
  town?: string;
  estate?: string;
  houseType?: HouseType;
  minRent?: number;
  maxRent?: number;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "rent" | "viewCount";
  sortOrder?: "asc" | "desc";
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  agencyName?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface AgentStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  expiringListings: number;
}
