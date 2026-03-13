import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { SearchListingDto } from "./dto/search-listing.dto";
import { Prisma, ListingStatus } from "@prisma/client";

// Select shape shared by list + detail queries
const PROPERTY_SELECT: Prisma.PropertySelect = {
  id: true, title: true, description: true, rent: true, deposit: true,
  houseType: true, status: true, isVerified: true, isBoosted: true,
  address: true, latitude: true, longitude: true,
  viewCount: true, expiresAt: true, createdAt: true, updatedAt: true,
  county: { select: { id: true, name: true, slug: true, region: true } },
  town:   { select: { id: true, name: true, slug: true } },
  estate: { select: { id: true, name: true, slug: true } },
  images: { select: { id: true, url: true, publicId: true, isPrimary: true } },
  agent:  { select: { id: true, name: true, phone: true, whatsapp: true, agencyName: true, verified: true, avatarUrl: true } },
  amenities: { select: { amenity: { select: { id: true, label: true, icon: true } } } },
};

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma:    PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ─── Search ─────────────────────────────────────────────────────────────────

  async search(dto: SearchListingDto) {
    const { county, town, estate, houseType, minRent, maxRent,
            page = 1, limit = 12, sortBy = "createdAt", sortOrder = "desc" } = dto;

    const where: Prisma.PropertyWhereInput = {
      status: ListingStatus.ACTIVE,
      ...(county    && { county:    { name: { contains: county,  mode: "insensitive" } } }),
      ...(town      && { town:      { name: { contains: town,    mode: "insensitive" } } }),
      ...(estate    && { estate:    { name: { contains: estate,  mode: "insensitive" } } }),
      ...(houseType && { houseType }),
      ...(minRent !== undefined || maxRent !== undefined) && {
        rent: {
          ...(minRent !== undefined && { gte: minRent }),
          ...(maxRent !== undefined && { lte: maxRent }),
        },
      },
      expiresAt: { gte: new Date() },
    };

    const [total, data] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        select: PROPERTY_SELECT,
        orderBy: sortBy === "rent"
          ? { rent: sortOrder }
          : { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: this.transformList(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Featured ───────────────────────────────────────────────────────────────

  async getFeatured() {
    const data = await this.prisma.property.findMany({
      where:   { status: ListingStatus.ACTIVE, isVerified: true },
      select:  PROPERTY_SELECT,
      orderBy: [{ isBoosted: "desc" }, { viewCount: "desc" }],
      take: 6,
    });
    return this.transformList(data);
  }

  // ─── Get one ────────────────────────────────────────────────────────────────

  async getById(id: string) {
    const p = await this.prisma.property.findUnique({
      where:  { id },
      select: PROPERTY_SELECT,
    });
    if (!p) throw new NotFoundException("Property not found");
    return this.transform(p);
  }

  // ─── Create ─────────────────────────────────────────────────────────────────

  async create(agentId: string, dto: CreateListingDto, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("At least one photo is required");
    }

    // Resolve / create county, town, estate
    const county = await this.prisma.county.findFirst({
      where: { name: { contains: dto.county, mode: "insensitive" } },
    });
    if (!county) throw new BadRequestException(`County "${dto.county}" not found`);

    let town = await this.prisma.town.findFirst({
      where: { countyId: county.id, name: { contains: dto.town, mode: "insensitive" } },
    });
    if (!town) {
      town = await this.prisma.town.create({
        data: { name: dto.town, slug: this.slugify(dto.town), countyId: county.id },
      });
    }

    let estateId: string | undefined;
    if (dto.estate) {
      let estate = await this.prisma.estate.findFirst({
        where: { townId: town.id, name: { contains: dto.estate, mode: "insensitive" } },
      });
      if (!estate) {
        estate = await this.prisma.estate.create({
          data: { name: dto.estate, slug: this.slugify(dto.estate), townId: town.id },
        });
      }
      estateId = estate.id;
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map((f, i) => this.cloudinary.upload(f, { folder: "nyumbasasa" }).then((r) => ({
        url:       r.secure_url,
        publicId:  r.public_id,
        isPrimary: i === 0,
      })))
    );

    const property = await this.prisma.property.create({
      data: {
        title:       dto.title,
        description: dto.description,
        rent:        dto.rent,
        deposit:     dto.deposit,
        houseType:   dto.houseType,
        address:     dto.address,
        latitude:    dto.latitude,
        longitude:   dto.longitude,
        countyId:    county.id,
        townId:      town.id,
        estateId,
        agentId,
        images: { createMany: { data: uploadedImages } },
        ...(dto.amenityIds?.length && {
          amenities: {
            createMany: { data: dto.amenityIds.map((id) => ({ amenityId: id })) },
          },
        }),
      },
      select: PROPERTY_SELECT,
    });

    return this.transform(property);
  }

  // ─── Update ─────────────────────────────────────────────────────────────────

  async update(id: string, agentId: string, role: string, dto: Partial<CreateListingDto>, files: Express.Multer.File[]) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException("Property not found");
    if (property.agentId !== agentId && role !== "ADMIN") {
      throw new ForbiddenException("You can only edit your own listings");
    }

    // Resolve location changes if provided
    let countyId  = property.countyId;
    let townId    = property.townId;
    let estateId  = property.estateId ?? undefined;

    if (dto.county) {
      const county = await this.prisma.county.findFirst({
        where: { name: { contains: dto.county, mode: "insensitive" } },
      });
      if (!county) throw new BadRequestException(`County "${dto.county}" not found`);
      countyId = county.id;

      if (dto.town) {
        let t = await this.prisma.town.findFirst({
          where: { countyId, name: { contains: dto.town, mode: "insensitive" } },
        });
        if (!t) {
          t = await this.prisma.town.create({
            data: { name: dto.town, slug: this.slugify(dto.town), countyId },
          });
        }
        townId = t.id;
      }

      if (dto.estate) {
        let e = await this.prisma.estate.findFirst({
          where: { townId, name: { contains: dto.estate, mode: "insensitive" } },
        });
        if (!e) {
          e = await this.prisma.estate.create({
            data: { name: dto.estate, slug: this.slugify(dto.estate), townId },
          });
        }
        estateId = e.id;
      }
    }

    // Upload any new images
    if (files && files.length > 0) {
      const uploaded = await Promise.all(
        files.map((f, i) => this.cloudinary.upload(f, { folder: "nyumbasasa" }).then((r) => ({
          url: r.secure_url, publicId: r.public_id, isPrimary: false,
        })))
      );
      await this.prisma.propertyImage.createMany({
        data: uploaded.map((img) => ({ ...img, propertyId: id })),
      });
    }

    const updated = await this.prisma.property.update({
      where: { id },
      data: {
        ...(dto.title       && { title:       dto.title       }),
        ...(dto.description && { description: dto.description }),
        ...(dto.rent        && { rent:        dto.rent        }),
        ...(dto.deposit     !== undefined && { deposit: dto.deposit }),
        ...(dto.houseType   && { houseType:   dto.houseType   }),
        ...(dto.address     && { address:     dto.address     }),
        ...(dto.latitude    && { latitude:    dto.latitude    }),
        ...(dto.longitude   && { longitude:   dto.longitude   }),
        countyId, townId, estateId,
        status: "PENDING", // back to pending after edit, admin re-verifies
      },
      select: PROPERTY_SELECT,
    });

    return this.transform(updated);
  }

  // ─── Delete ─────────────────────────────────────────────────────────────────

  async delete(id: string, agentId: string, role: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException("Property not found");
    if (property.agentId !== agentId && role !== "ADMIN") {
      throw new ForbiddenException("You can only delete your own listings");
    }

    // Clean up Cloudinary images
    const images = await this.prisma.propertyImage.findMany({ where: { propertyId: id } });
    await Promise.all(images.map((img) => this.cloudinary.destroy(img.publicId)));

    await this.prisma.property.delete({ where: { id } });
    return { deleted: true };
  }

  // ─── Increment view ─────────────────────────────────────────────────────────

  async incrementView(id: string) {
    await this.prisma.property.update({
      where: { id },
      data:  { viewCount: { increment: 1 } },
    });
  }

  // ─── Report ─────────────────────────────────────────────────────────────────

  async report(propertyId: string, reporterId: string, reason: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException("Property not found");

    await this.prisma.listingReport.create({
      data: { propertyId, reporterId, reason },
    });
    return { reported: true };
  }

  // ─── Agent dashboard: my listings ───────────────────────────────────────────

  async getMyListings(agentId: string, page = 1, limit = 10) {
    const [total, data] = await Promise.all([
      this.prisma.property.count({ where: { agentId } }),
      this.prisma.property.findMany({
        where:   { agentId },
        select:  PROPERTY_SELECT,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: this.transformList(data),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Transform helpers ──────────────────────────────────────────────────────

  private transform(p: any) {
    return {
      ...p,
      rent:      Number(p.rent),
      deposit:   Number(p.deposit),
      amenities: p.amenities?.map((a: any) => a.amenity) ?? [],
    };
  }

  private transformList(list: any[]) {
    return list.map((p) => this.transform(p));
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }
}
