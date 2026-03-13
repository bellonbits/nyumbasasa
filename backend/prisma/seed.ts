/**
 * Homify Kenya — Comprehensive Database Seeder
 * Run: npx ts-node prisma/seed.ts
 */
import { PrismaClient, UserRole, HouseType, ListingStatus } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

// ─── Counties ───────────────────────────────────────────────────────────────

const COUNTIES = [
  { name: "Nairobi",     slug: "nairobi",     region: "Nairobi"     },
  { name: "Mombasa",     slug: "mombasa",     region: "Coast"       },
  { name: "Kisumu",      slug: "kisumu",      region: "Nyanza"      },
  { name: "Nakuru",      slug: "nakuru",      region: "Rift Valley" },
  { name: "Kiambu",      slug: "kiambu",      region: "Central"     },
  { name: "Uasin Gishu", slug: "uasin-gishu", region: "Rift Valley" },
  { name: "Embu",        slug: "embu",        region: "Eastern"     },
  { name: "Meru",        slug: "meru",        region: "Eastern"     },
  { name: "Machakos",    slug: "machakos",    region: "Eastern"     },
  { name: "Nyeri",       slug: "nyeri",       region: "Central"     },
];

// ─── Amenities ──────────────────────────────────────────────────────────────

const AMENITIES = [
  { id: "wifi",          label: "WiFi",              icon: "📶" },
  { id: "water",         label: "Running Water",      icon: "💧" },
  { id: "security",      label: "24hr Security",      icon: "🔒" },
  { id: "parking",       label: "Parking Space",      icon: "🚗" },
  { id: "generator",     label: "Backup Generator",   icon: "⚡" },
  { id: "balcony",       label: "Balcony",            icon: "🏠" },
  { id: "gym",           label: "Gym",                icon: "💪" },
  { id: "swimming_pool", label: "Swimming Pool",      icon: "🏊" },
];

// ─── Unsplash images ─────────────────────────────────────────────────────────

const IMGS = {
  bedsitter:     [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  ],
  studio:        [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
  ],
  one_bedroom:   [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  ],
  two_bedroom:   [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80",
  ],
  three_bedroom: [
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  ],
};

function img(type: keyof typeof IMGS, index = 0) {
  const arr = IMGS[type];
  return arr[index % arr.length];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding Homify Kenya database...");

  // 1. Counties
  for (const county of COUNTIES) {
    await prisma.county.upsert({
      where:  { slug: county.slug },
      update: {},
      create: county,
    });
  }
  console.log(`✅ ${COUNTIES.length} counties seeded`);

  // 2. Amenities
  for (const amenity of AMENITIES) {
    await prisma.amenity.upsert({
      where:  { id: amenity.id },
      update: {},
      create: amenity,
    });
  }
  console.log(`✅ ${AMENITIES.length} amenities seeded`);

  // 3. County IDs
  const nairobi = await prisma.county.findUnique({ where: { slug: "nairobi" } });
  const mombasa = await prisma.county.findUnique({ where: { slug: "mombasa" } });
  const kisumu  = await prisma.county.findUnique({ where: { slug: "kisumu"  } });
  const nakuru  = await prisma.county.findUnique({ where: { slug: "nakuru"  } });
  const kiambu  = await prisma.county.findUnique({ where: { slug: "kiambu"  } });
  if (!nairobi || !mombasa || !kisumu || !nakuru || !kiambu) throw new Error("Counties missing");

  // 4. Towns & estates helpers
  const sl = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  async function upsertTown(name: string, countyId: string) {
    return prisma.town.upsert({
      where:  { countyId_slug: { countyId, slug: sl(name) } },
      update: {},
      create: { name, slug: sl(name), countyId },
    });
  }

  async function upsertEstate(name: string, townId: string) {
    return prisma.estate.upsert({
      where:  { townId_slug: { townId, slug: sl(name) } },
      update: {},
      create: { name, slug: sl(name), townId },
    });
  }

  const westlands  = await upsertTown("Westlands",  nairobi.id);
  const kasarani   = await upsertTown("Kasarani",   nairobi.id);
  const kilimani   = await upsertTown("Kilimani",   nairobi.id);
  const karen      = await upsertTown("Karen",       nairobi.id);
  const ruaka      = await upsertTown("Ruaka",       kiambu.id);
  const thika      = await upsertTown("Thika",       kiambu.id);
  const nyali      = await upsertTown("Nyali",       mombasa.id);
  const shanzu     = await upsertTown("Shanzu",      mombasa.id);
  const kisumucbd  = await upsertTown("Kisumu CBD",  kisumu.id);
  const milimani   = await upsertTown("Milimani",    kisumu.id);
  const nakurucbd  = await upsertTown("Nakuru CBD",  nakuru.id);
  const lanet      = await upsertTown("Lanet",       nakuru.id);

  const mirembe    = await upsertEstate("Mirembe Estate",  westlands.id);
  const mtView     = await upsertEstate("Mountain View",   kasarani.id);
  const runda      = await upsertEstate("Runda",           westlands.id);
  const nyaliEst   = await upsertEstate("Nyali Estate",    nyali.id);
  console.log("✅ Towns and estates seeded");

  // 5. Users
  const adminHash = await argon2.hash("Admin@NyumbaSasa2025!");
  await prisma.user.upsert({
    where:  { email: "admin@nyumbasasa.co.ke" },
    update: {},
    create: {
      name: "Homify Admin", email: "admin@nyumbasasa.co.ke",
      phone: "0700000001", password: adminHash,
      role: UserRole.ADMIN, verified: true,
    },
  });

  const agentHash = await argon2.hash("Agent@Demo2025!");
  const agentsData = [
    { email: "agent@nyumbasasa.co.ke",  name: "John Kamau",    phone: "0712345678", whatsapp: "254712345678", agency: "Kamau Realtors Ltd"       },
    { email: "grace@nyumbasasa.co.ke",  name: "Grace Wanjiku", phone: "0722100200", whatsapp: "254722100200", agency: "Wanjiku Real Estate"       },
    { email: "david@nyumbasasa.co.ke",  name: "David Mwangi",  phone: "0733200300", whatsapp: "254733200300", agency: "Nairobi Homes Ltd"         },
    { email: "fatuma@nyumbasasa.co.ke", name: "Fatuma Hassan", phone: "0711300400", whatsapp: "254711300400", agency: "Coast Properties Agency"   },
    { email: "peter@nyumbasasa.co.ke",  name: "Peter Ochieng", phone: "0745400500", whatsapp: "254745400500", agency: "Rift Valley Homes"         },
    { email: "akinyi@nyumbasasa.co.ke", name: "Akinyi Otieno", phone: "0700500600", whatsapp: "254700500600", agency: "Lakeside Properties"       },
  ];

  const agents: Record<string, string> = {};
  for (const a of agentsData) {
    const u = await prisma.user.upsert({
      where:  { email: a.email },
      update: {},
      create: {
        name: a.name, email: a.email, phone: a.phone,
        whatsapp: a.whatsapp, agencyName: a.agency,
        password: agentHash, role: UserRole.AGENT, verified: true,
      },
    });
    agents[a.email] = u.id;
  }
  console.log("✅ 6 agents seeded");

  // 6. Properties
  type P = {
    id: string; title: string; description: string;
    rent: number; deposit: number; houseType: HouseType;
    isVerified: boolean; isBoosted: boolean;
    countyId: string; townId: string; estateId?: string;
    agentEmail: string; img1: string; img2?: string;
    amenities: string[]; lat?: number; lng?: number;
  };

  const EXP = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const props: P[] = [
    // Nairobi – Westlands
    { id:"prop-nbi-001", title:"Modern Bedsitter near Westgate Mall",
      description:"Freshly renovated bedsitter with tiled floors, built-in wardrobe, and a private shower room. Reliable water via tank backup, 24hr security askari, and convenient access to Westgate, supermarkets and matatus. Ideal for a young professional.",
      rent:9000, deposit:9000, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:true,
      countyId:nairobi.id, townId:westlands.id, estateId:mirembe.id, agentEmail:"agent@nyumbasasa.co.ke",
      img1:img("bedsitter",0), img2:img("bedsitter",1), amenities:["water","security","wifi"],
      lat:-1.2678, lng:36.8097 },

    { id:"prop-nbi-002", title:"Spacious Studio Apartment – Kilimani",
      description:"A well-lit self-contained studio in the heart of Kilimani. Features open-plan living/bedroom, modern kitchen with gas cooker, clean bathroom, and a small balcony. Close to Yaya Centre, restaurants, and Ngong Road buses.",
      rent:18000, deposit:18000, houseType:HouseType.STUDIO, isVerified:true, isBoosted:false,
      countyId:nairobi.id, townId:kilimani.id, agentEmail:"grace@nyumbasasa.co.ke",
      img1:img("studio",0), img2:img("studio",1), amenities:["water","security","wifi","balcony"],
      lat:-1.2892, lng:36.7850 },

    { id:"prop-nbi-003", title:"Bright 1-Bedroom Apartment – Kasarani",
      description:"A spacious 1-bedroom apartment in a quiet compound in Kasarani. Features a separate living room, fitted kitchen, master bedroom with en-suite, and ample parking. Near Kasarani Stadium, Thika Road Mall, and good schools.",
      rent:16000, deposit:16000, houseType:HouseType.ONE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:nairobi.id, townId:kasarani.id, estateId:mtView.id, agentEmail:"david@nyumbasasa.co.ke",
      img1:img("one_bedroom",0), img2:img("one_bedroom",1), amenities:["water","security","parking","wifi"],
      lat:-1.2200, lng:36.8960 },

    { id:"prop-nbi-004", title:"Executive 2BR Apartment – Westlands",
      description:"Fully furnished 2-bedroom apartment on the 4th floor with panoramic views of Westlands. Features Italian tiles, modern kitchen, en-suite master, study nook, and 2 parking bays. Generator, gym, and pool on site.",
      rent:55000, deposit:110000, houseType:HouseType.TWO_BEDROOM, isVerified:true, isBoosted:true,
      countyId:nairobi.id, townId:westlands.id, agentEmail:"grace@nyumbasasa.co.ke",
      img1:img("two_bedroom",0), img2:img("two_bedroom",1), amenities:["water","security","parking","wifi","generator","gym","swimming_pool","balcony"],
      lat:-1.2631, lng:36.8072 },

    { id:"prop-nbi-005", title:"Affordable Bedsitter – Kasarani Mwiki Road",
      description:"Clean and secure bedsitter ideal for a single person. The compound has reliable water, CCTV, and a caretaker. Walking distance to Kasarani stage and local market. Perfect for budget renters.",
      rent:6500, deposit:6500, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:false,
      countyId:nairobi.id, townId:kasarani.id, agentEmail:"agent@nyumbasasa.co.ke",
      img1:img("bedsitter",2), amenities:["water","security"],
      lat:-1.2100, lng:36.9050 },

    { id:"prop-nbi-006", title:"Karen 3-Bedroom Family Home",
      description:"Stunning 3-bedroom bungalow in a leafy Karen compound. Large garden, double garage, DSQ, and modern kitchen. Very quiet neighbourhood with excellent security. 10 minutes from Wilson Airport.",
      rent:95000, deposit:190000, houseType:HouseType.THREE_BEDROOM, isVerified:true, isBoosted:true,
      countyId:nairobi.id, townId:karen.id, agentEmail:"david@nyumbasasa.co.ke",
      img1:img("three_bedroom",0), img2:img("three_bedroom",1), amenities:["water","security","parking","wifi","generator","balcony"],
      lat:-1.3520, lng:36.7100 },

    { id:"prop-nbi-007", title:"Studio with City Views – Kilimani",
      description:"Compact but stylish studio on the 6th floor with great natural light and views of Nairobi skyline. Modern bathroom, open kitchen, and fast fibre internet. Ideal for a remote worker.",
      rent:22000, deposit:22000, houseType:HouseType.STUDIO, isVerified:false, isBoosted:false,
      countyId:nairobi.id, townId:kilimani.id, agentEmail:"grace@nyumbasasa.co.ke",
      img1:img("studio",2), amenities:["water","security","wifi","balcony"],
      lat:-1.2900, lng:36.7820 },

    { id:"prop-nbi-008", title:"Cozy 1BR – Westlands Parklands Border",
      description:"Lovely 1-bedroom apartment in a secure gated compound at the Westlands/Parklands border. Spacious living room, separate bedroom, fitted kitchen with granite tops. Close to Aga Khan Hospital.",
      rent:28000, deposit:28000, houseType:HouseType.ONE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:nairobi.id, townId:westlands.id, agentEmail:"agent@nyumbasasa.co.ke",
      img1:img("one_bedroom",2), amenities:["water","security","parking","wifi"],
      lat:-1.2650, lng:36.8130 },

    { id:"prop-nbi-009", title:"Comfortable Bedsitter – Kilimani",
      description:"Recently painted bedsitter in a quiet Kilimani compound. Wardrobe space, private bathroom, reliable water, and a shared rooftop area. Walking distance to Adams Arcade and Ngong Road.",
      rent:12000, deposit:12000, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:false,
      countyId:nairobi.id, townId:kilimani.id, agentEmail:"grace@nyumbasasa.co.ke",
      img1:img("bedsitter",1), amenities:["water","security","wifi"],
      lat:-1.2930, lng:36.7880 },

    { id:"prop-nbi-010", title:"1BR with Gym Access – Kilimani",
      description:"Well-designed 1-bedroom apartment in a lifestyle complex in Kilimani. Residents enjoy access to a fully equipped gym, rooftop garden, and concierge service. High-speed fibre included.",
      rent:38000, deposit:38000, houseType:HouseType.ONE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:nairobi.id, townId:kilimani.id, agentEmail:"david@nyumbasasa.co.ke",
      img1:img("one_bedroom",1), amenities:["water","security","parking","wifi","gym","balcony"],
      lat:-1.2870, lng:36.7830 },

    { id:"prop-nbi-011", title:"Penthouse 3BR – Westlands Runda",
      description:"Rare penthouse 3-bedroom apartment in Runda offering 360-degree Nairobi views. Designer kitchen, private terrace, 3 en-suites, and 3 parking bays. One of Nairobi's most prestigious addresses.",
      rent:180000, deposit:360000, houseType:HouseType.THREE_BEDROOM, isVerified:true, isBoosted:true,
      countyId:nairobi.id, townId:westlands.id, estateId:runda.id, agentEmail:"grace@nyumbasasa.co.ke",
      img1:img("three_bedroom",0), img2:img("three_bedroom",2), amenities:["water","security","parking","wifi","generator","gym","swimming_pool","balcony"],
      lat:-1.2380, lng:36.7960 },

    // Kiambu
    { id:"prop-kia-001", title:"Modern Bedsitter – Ruaka Town",
      description:"Brand new bedsitter in a 4-storey apartment block in Ruaka. Features high ceilings, quality tiles, fitted wardrobe, and a clean bathroom. 5 minutes walk to Ruaka market and easy access to Nairobi via bypass.",
      rent:7000, deposit:7000, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:false,
      countyId:kiambu.id, townId:ruaka.id, agentEmail:"agent@nyumbasasa.co.ke",
      img1:img("bedsitter",0), amenities:["water","security","wifi"],
      lat:-1.1850, lng:36.7570 },

    { id:"prop-kia-002", title:"Studio Apartment – Ruaka near Limuru Road",
      description:"Clean self-contained studio in Ruaka ideal for a single professional. Running water 24hrs, CCTV, and WiFi included. Walking distance to Quickmart and Ruaka stage.",
      rent:11000, deposit:11000, houseType:HouseType.STUDIO, isVerified:true, isBoosted:false,
      countyId:kiambu.id, townId:ruaka.id, agentEmail:"grace@nyumbasasa.co.ke",
      img1:img("studio",1), amenities:["water","security","wifi"],
      lat:-1.1920, lng:36.7610 },

    { id:"prop-kia-003", title:"Spacious 2BR Apartment – Thika Town",
      description:"Well-maintained 2-bedroom apartment near Blue Post Hotel in Thika. Tiled throughout, spacious lounge, fitted kitchen, and secure parking. Perfect for a family moving out of Nairobi.",
      rent:22000, deposit:22000, houseType:HouseType.TWO_BEDROOM, isVerified:true, isBoosted:false,
      countyId:kiambu.id, townId:thika.id, agentEmail:"david@nyumbasasa.co.ke",
      img1:img("two_bedroom",1), amenities:["water","security","parking"],
      lat:-1.0396, lng:37.0900 },

    { id:"prop-kia-004", title:"New 2BR Apartment – Ruaka off Limuru Road",
      description:"Newly built 2-bedroom apartment in a modern block in Ruaka. Features open-plan living, semi-fitted kitchen, 2 bathrooms, and covered parking. 15 minutes to Westlands by matatu.",
      rent:32000, deposit:32000, houseType:HouseType.TWO_BEDROOM, isVerified:true, isBoosted:false,
      countyId:kiambu.id, townId:ruaka.id, agentEmail:"agent@nyumbasasa.co.ke",
      img1:img("two_bedroom",0), amenities:["water","security","parking","wifi"],
      lat:-1.1900, lng:36.7600 },

    // Mombasa
    { id:"prop-mom-001", title:"Beachside Bedsitter – Nyali",
      description:"Cozy bedsitter 5 minutes from Nyali Beach. Stone-built compound with sea breeze, reliable borehole water, and 24hr guards. Perfect for coast professionals. Near Nakumatt Nyali and Nyali Bridge.",
      rent:8500, deposit:8500, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:true,
      countyId:mombasa.id, townId:nyali.id, estateId:nyaliEst.id, agentEmail:"fatuma@nyumbasasa.co.ke",
      img1:img("bedsitter",1), amenities:["water","security"],
      lat:-4.0320, lng:39.7200 },

    { id:"prop-mom-002", title:"1-Bedroom Apartment – Nyali Estate",
      description:"Well-kept 1-bedroom apartment in a quiet Nyali compound. Full en-suite, modern kitchen, private porch, and covered parking. Walking distance to shopping and the beach.",
      rent:20000, deposit:20000, houseType:HouseType.ONE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:mombasa.id, townId:nyali.id, agentEmail:"fatuma@nyumbasasa.co.ke",
      img1:img("one_bedroom",0), amenities:["water","security","parking","wifi"],
      lat:-4.0350, lng:39.7220 },

    { id:"prop-mom-003", title:"Luxury 2BR with Ocean Views – Shanzu",
      description:"Stunning 2-bedroom apartment in a resort-style complex in Shanzu, 200m from the beach. Furnished, swimming pool, gym, and high-speed WiFi included in the rent. Ideal for remote workers.",
      rent:45000, deposit:45000, houseType:HouseType.TWO_BEDROOM, isVerified:true, isBoosted:true,
      countyId:mombasa.id, townId:shanzu.id, agentEmail:"fatuma@nyumbasasa.co.ke",
      img1:img("two_bedroom",0), img2:img("two_bedroom",2), amenities:["water","security","parking","wifi","swimming_pool","gym","balcony"],
      lat:-3.9200, lng:39.7300 },

    { id:"prop-mom-004", title:"Budget Studio – Mombasa CBD",
      description:"Affordable self-contained studio in the heart of Mombasa CBD. Walking distance to ferry, market, and government offices. Good for single professionals working in town.",
      rent:7000, deposit:7000, houseType:HouseType.STUDIO, isVerified:false, isBoosted:false,
      countyId:mombasa.id, townId:nyali.id, agentEmail:"fatuma@nyumbasasa.co.ke",
      img1:img("studio",0), amenities:["water","security"] },

    { id:"prop-mom-005", title:"3BR Family Home – Nyali",
      description:"Spacious 3-bedroom house in a peaceful Nyali neighbourhood. Large garden, garage, DSQ, and borehole. Close to international schools and golf club. One of the best family homes on the coast.",
      rent:80000, deposit:160000, houseType:HouseType.THREE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:mombasa.id, townId:nyali.id, agentEmail:"fatuma@nyumbasasa.co.ke",
      img1:img("three_bedroom",1), amenities:["water","security","parking","wifi","generator"],
      lat:-4.0300, lng:39.7180 },

    // Kisumu
    { id:"prop-ksu-001", title:"Lake-View Bedsitter – Kisumu CBD",
      description:"Cozy bedsitter in a secure apartment block near Kisumu CBD with partial lake views. Reliable water, caretaker on site, and convenient to matatus, market, and Jomo Kenyatta Sports Ground.",
      rent:6000, deposit:6000, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:false,
      countyId:kisumu.id, townId:kisumucbd.id, agentEmail:"akinyi@nyumbasasa.co.ke",
      img1:img("bedsitter",0), amenities:["water","security"],
      lat:-0.0917, lng:34.7679 },

    { id:"prop-ksu-002", title:"Modern 1BR Flat – Milimani, Kisumu",
      description:"Tastefully done 1-bedroom apartment in upmarket Milimani. Features tiled living area, kitchenette, clean bathroom, and a porch. Near Aga Khan Hospital and good schools.",
      rent:14000, deposit:14000, houseType:HouseType.ONE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:kisumu.id, townId:milimani.id, agentEmail:"akinyi@nyumbasasa.co.ke",
      img1:img("one_bedroom",1), amenities:["water","security","parking","wifi"],
      lat:-0.1050, lng:34.7550 },

    { id:"prop-ksu-003", title:"Affordable 2BR – Kisumu CBD",
      description:"Clean 2-bedroom apartment near Kisumu Bus Station. Walking distance to market, banks, and offices. Suitable for a small family or two sharers. Compound has CCTV and borehole.",
      rent:16000, deposit:16000, houseType:HouseType.TWO_BEDROOM, isVerified:true, isBoosted:false,
      countyId:kisumu.id, townId:kisumucbd.id, agentEmail:"akinyi@nyumbasasa.co.ke",
      img1:img("two_bedroom",1), amenities:["water","security"],
      lat:-0.1020, lng:34.7620 },

    { id:"prop-ksu-004", title:"Studio near Kisumu Airport",
      description:"Simple self-contained studio 2km from Kisumu International Airport. Borehole water, CCTV, caretaker. Ideal for pilots, airline staff, or frequent travellers.",
      rent:8000, deposit:8000, houseType:HouseType.STUDIO, isVerified:false, isBoosted:false,
      countyId:kisumu.id, townId:kisumucbd.id, agentEmail:"akinyi@nyumbasasa.co.ke",
      img1:img("studio",2), amenities:["water","security"] },

    // Nakuru
    { id:"prop-nak-001", title:"Budget Bedsitter – Nakuru CBD",
      description:"Affordable bedsitter close to Nakuru CBD, near Westside Mall and matatu terminus. Running water, CCTV security, and a helpful caretaker. Perfect for students and young workers.",
      rent:5500, deposit:5500, houseType:HouseType.BEDSITTER, isVerified:true, isBoosted:false,
      countyId:nakuru.id, townId:nakurucbd.id, agentEmail:"peter@nyumbasasa.co.ke",
      img1:img("bedsitter",2), amenities:["water","security"],
      lat:-0.3031, lng:36.0800 },

    { id:"prop-nak-002", title:"1-Bedroom Apartment – Lanet, Nakuru",
      description:"Clean 1-bedroom apartment in Lanet, a quiet residential area 5km from Nakuru CBD. Separate living room, modern bathroom, and a small kitchen garden. Great for families seeking peace and quiet.",
      rent:12000, deposit:12000, houseType:HouseType.ONE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:nakuru.id, townId:lanet.id, agentEmail:"peter@nyumbasasa.co.ke",
      img1:img("one_bedroom",2), amenities:["water","security","parking"],
      lat:-0.2450, lng:36.1100 },

    { id:"prop-nak-003", title:"Studio Apartment – Nakuru Town Centre",
      description:"Well-maintained studio apartment 3 minutes walk from Nakuru Bus Station and Westside Mall. Perfect for a professional or student wanting to be central. All bills included.",
      rent:9000, deposit:9000, houseType:HouseType.STUDIO, isVerified:true, isBoosted:false,
      countyId:nakuru.id, townId:nakurucbd.id, agentEmail:"peter@nyumbasasa.co.ke",
      img1:img("studio",0), amenities:["water","security","wifi"],
      lat:-0.3050, lng:36.0700 },

    { id:"prop-nak-004", title:"Spacious 2BR – Nakuru Milimani",
      description:"Beautiful 2-bedroom apartment in Nakuru Milimani Estate. High-end finishes, fitted wardrobes, open-plan kitchen with granite tops, and covered parking. Quiet compound with swimming pool.",
      rent:28000, deposit:28000, houseType:HouseType.TWO_BEDROOM, isVerified:true, isBoosted:true,
      countyId:nakuru.id, townId:nakurucbd.id, agentEmail:"peter@nyumbasasa.co.ke",
      img1:img("two_bedroom",2), amenities:["water","security","parking","wifi","swimming_pool","balcony"],
      lat:-0.2900, lng:36.0850 },

    { id:"prop-nak-005", title:"3BR Family House – Lanet",
      description:"Standalone 3-bedroom house on a 1/8 acre in Lanet. Large compound with garden, servants quarters, and garage. Borehole water and solar panels for minimal utility bills.",
      rent:35000, deposit:70000, houseType:HouseType.THREE_BEDROOM, isVerified:true, isBoosted:false,
      countyId:nakuru.id, townId:lanet.id, agentEmail:"peter@nyumbasasa.co.ke",
      img1:img("three_bedroom",2), amenities:["water","security","parking","generator"],
      lat:-0.2400, lng:36.1050 },
  ];

  let created = 0;
  for (const p of props) {
    const agentId = agents[p.agentEmail];
    if (!agentId) { console.warn(`⚠️  Agent not found: ${p.agentEmail}`); continue; }

    const images = [
      { url: p.img1, publicId: `seed/${p.id}-1`, isPrimary: true },
      ...(p.img2 ? [{ url: p.img2, publicId: `seed/${p.id}-2`, isPrimary: false }] : []),
    ];

    await prisma.property.upsert({
      where:  { id: p.id },
      update: {},
      create: {
        id:         p.id,
        title:      p.title,
        description:p.description,
        rent:       p.rent,
        deposit:    p.deposit,
        houseType:  p.houseType,
        status:     ListingStatus.ACTIVE,
        isVerified: p.isVerified,
        isBoosted:  p.isBoosted,
        countyId:   p.countyId,
        townId:     p.townId,
        ...(p.estateId && { estateId: p.estateId }),
        ...(p.lat && { latitude: p.lat }),
        ...(p.lng && { longitude: p.lng }),
        agentId,
        expiresAt: EXP,
        images:    { createMany: { data: images } },
        amenities: { createMany: { data: p.amenities.map((amenityId) => ({ amenityId })) } },
      },
    });
    created++;
  }
  console.log(`✅ ${created} properties seeded`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("   Admin:  admin@nyumbasasa.co.ke  / Admin@NyumbaSasa2025!");
  console.log("   Agent:  agent@nyumbasasa.co.ke  / Agent@Demo2025!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
