# 🏠 NyumbaSasa – Kenya's Affordable Rental Marketplace

> Find bedsitters, studios, and apartments across all 47 Kenyan counties.
> Connect directly with agents via WhatsApp — no hidden fees.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / CDN                           │
│                    (Cloudflare / Vercel Edge)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
     ┌──────▼──────┐                 ┌──────▼──────┐
     │  FRONTEND   │                 │   BACKEND   │
     │  Next.js 14 │  REST / HTTPS   │  NestJS 10  │
     │  App Router │ ◄────────────► │  Port 3001  │
     │  Port 3000  │                 └──────┬──────┘
     └─────────────┘                        │
                                    ┌───────┴────────┐
                                    │                │
                              ┌─────▼─────┐   ┌─────▼─────┐
                              │ PostgreSQL│   │   Redis   │
                              │  (Prisma) │   │  (Cache)  │
                              └───────────┘   └───────────┘
                                    │
                              ┌─────▼─────┐
                              │Cloudinary │
                              │  (Images) │
                              └───────────┘
```

---

## 🗂️ Project Structure

```
NyumbaSasa/
├── frontend/                   # Next.js 14 (App Router) + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── (main)/         # Public-facing pages
│   │   │   │   ├── page.tsx            # Landing page
│   │   │   │   ├── search/page.tsx     # Search results + filters
│   │   │   │   └── property/[id]/      # Property detail
│   │   │   ├── (dashboard)/    # Agent protected area
│   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx        # Stats overview
│   │   │   │       ├── listings/       # Manage listings
│   │   │   │       └── add-listing/    # Create new listing
│   │   │   └── auth/           # Login / Register
│   │   ├── components/
│   │   │   ├── home/           # Landing page sections
│   │   │   ├── listings/       # PropertyCard, FilterSidebar
│   │   │   └── layout/         # Navbar, Footer
│   │   ├── hooks/              # React Query hooks
│   │   ├── lib/                # Axios client, utils, query client
│   │   └── types/              # TypeScript interfaces
│   └── public/                 # Static assets, PWA manifest
│
├── backend/                    # NestJS 10 + TypeScript
│   ├── src/
│   │   ├── auth/               # JWT auth, guards, decorators
│   │   ├── listings/           # CRUD + search + reports
│   │   ├── dashboard/          # Agent stats & my listings
│   │   ├── locations/          # Counties → Towns → Estates
│   │   ├── cloudinary/         # Image upload service
│   │   ├── prisma/             # Prisma client service
│   │   └── common/             # Filters, interceptors
│   └── prisma/
│       ├── schema.prisma       # Full DB schema
│       └── seed.ts             # Database seeder
│
└── docker-compose.yml          # Full stack local dev
```

---

## 🗄️ Database Schema (ERD Summary)

```
User ─────────────────────────────────────────────────────────────
  id, name, email (unique), phone (unique), password (hashed)
  role: ADMIN | AGENT | USER
  agencyName, bio, whatsapp, verified, active

County ──────────── Town ──────────── Estate
  name (unique)       name              name
  slug (unique)       slug              slug
  region              countyId FK       townId FK

Property ─────────────────────────────────────────────────────────
  title, description, rent, deposit
  houseType: BEDSITTER | STUDIO | ONE_BEDROOM | TWO_BEDROOM | THREE_BEDROOM
  status: PENDING | ACTIVE | ARCHIVED | REJECTED
  isVerified, isBoosted, boostedUntil
  countyId FK, townId FK, estateId FK (optional)
  address, latitude, longitude
  viewCount, expiresAt (auto 30 days), agentId FK

PropertyImage
  url (Cloudinary), publicId, isPrimary, propertyId FK

Amenity ─────────── PropertyAmenity (junction)
  id, label, icon     propertyId FK, amenityId FK

ListingReport
  propertyId FK, reporterId FK, reason, resolved

SavedListing (junction)
  userId FK, propertyId FK, savedAt
```

**Indexes for search performance:**
- `(status, countyId, houseType)` – primary search filter
- `(countyId, townId)` – location drill-down
- `(rent)` – budget range queries
- `(createdAt DESC)` – default sort
- `(expiresAt)` – scheduled archiving job

---

## 🔌 API Routes

```
AUTH
  POST   /api/auth/register    – Agent registration
  POST   /api/auth/login       – Login → JWT tokens
  GET    /api/auth/me          – Current user (protected)
  POST   /api/auth/logout      – Logout

PROPERTIES
  GET    /api/properties                    – Search (filters via query params)
  GET    /api/properties/featured           – Featured listings
  GET    /api/properties/:id                – Property detail
  POST   /api/properties                    – Create (multipart, protected)
  PATCH  /api/properties/:id                – Update (multipart, protected)
  DELETE /api/properties/:id                – Delete (protected)
  POST   /api/properties/:id/view           – Increment view count
  POST   /api/properties/:id/report         – Report listing (protected)

DASHBOARD (all protected)
  GET    /api/dashboard/stats               – Agent stats
  GET    /api/dashboard/listings            – My listings (paginated)

LOCATIONS
  GET    /api/locations/counties            – All counties + listing counts
  GET    /api/locations/counties/:id/towns  – Towns in county
  GET    /api/locations/towns/:id/estates   – Estates in town
```

**Sample Search Request:**
```
GET /api/properties?county=Nairobi&houseType=BEDSITTER&minRent=5000&maxRent=12000&page=1&limit=12&sortBy=rent&sortOrder=asc
```

**Sample Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Cozy Bedsitter near Westgate Mall",
      "rent": 9000,
      "deposit": 9000,
      "houseType": "BEDSITTER",
      "status": "ACTIVE",
      "isVerified": true,
      "county": { "name": "Nairobi", "slug": "nairobi" },
      "town":   { "name": "Westlands" },
      "images": [{ "url": "https://res.cloudinary.com/...", "isPrimary": true }],
      "agent":  { "name": "John Kamau", "whatsapp": "0712345678", "verified": true }
    }
  ],
  "meta": { "total": 843, "page": 1, "limit": 12, "totalPages": 71 }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Cloudinary account (free tier works)

### 1. Clone & configure
```bash
cd NyumbaSasa
cp backend/.env.example backend/.env
# Edit backend/.env with your Cloudinary credentials and a strong JWT_SECRET
```

### 2. Start with Docker (recommended)
```bash
docker-compose up -d
```

### 3. Run migrations & seed
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

### 4. Start development servers
```bash
# Terminal 1 – Backend
cd backend && npm run start:dev

# Terminal 2 – Frontend
cd frontend && npm install && npm run dev
```

Open: http://localhost:3000

**Demo credentials:**
- Admin: `admin@nyumbasasa.co.ke` / `Admin@NyumbaSasa2025!`
- Agent: `agent@nyumbasasa.co.ke` / `Agent@Demo2025!`

---

## 🔒 Security & Anti-Fraud

| Feature | Implementation |
|---|---|
| JWT Auth | Short-lived access tokens (1d) + refresh (7d) |
| Password hashing | Argon2id (memory-hard) |
| Rate limiting | 60 req/min via @nestjs/throttler |
| HTTP security | Helmet.js headers |
| Input validation | class-validator DTOs with whitelist |
| Listing expiry | Auto-archive after 30 days |
| Admin verification | Listings start as PENDING |
| Report system | Users can flag suspicious listings |
| Duplicate detection | Phone + email uniqueness at DB level |
| Image uploads | Server-side validation, size limits |

---

## 📦 Deployment (Production)

### Recommended Stack
| Service | Provider | Notes |
|---|---|---|
| Frontend | Vercel | Zero-config Next.js deploy |
| Backend | Railway / Render | NestJS Node.js server |
| Database | Supabase / Neon | Managed PostgreSQL |
| Redis | Upstash | Serverless Redis |
| Images | Cloudinary | CDN + transforms |
| DNS / CDN | Cloudflare | Free CDN + DDoS protection |

### CI/CD Pipeline (GitHub Actions)
```yaml
# Triggers on push to main
1. Run ESLint + TypeScript checks
2. Run unit tests
3. Build Docker images
4. Push to container registry
5. Deploy to Railway / Render via webhook
6. Run prisma migrate deploy
```

---

## 🗺️ Feature Roadmap

### Phase 1 – MVP (Current)
- [x] Landing page with search
- [x] Property listings with filters
- [x] Property detail with WhatsApp contact
- [x] Agent registration & dashboard
- [x] Image uploads via Cloudinary
- [x] Admin verification workflow

### Phase 2 – Growth
- [ ] SMS alerts (Africa's Talking API)
- [ ] Interactive map view (Leaflet)
- [ ] Boosted listings (Mpesa payment)
- [ ] Saved/favourites listings
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3 – Scale
- [ ] AI-powered price estimator
- [ ] Virtual tour support (360°)
- [ ] Tenant credit scoring
- [ ] Lease management module
- [ ] WhatsApp Business API integration

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#c97c20` (Warm Amber) |
| Surface | `#FAFAF8` (Off-white) |
| Card BG | `#FFFFFF` |
| Muted | `#F4F1EC` |
| Font Heading | Poppins 600–800 |
| Font Body | Inter 400–600 |
| Border Radius | 12px (cards), 8px (inputs) |

---

*Built with ❤️ for Kenyan renters.*
