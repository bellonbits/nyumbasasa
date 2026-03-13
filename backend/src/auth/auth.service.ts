import {
  Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma:  PrismaService,
    private readonly jwt:     JwtService,
    private readonly config:  ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existing) throw new ConflictException("Email or phone already registered");

    const hash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name:       dto.name,
        email:      dto.email,
        phone:      dto.phone,
        agencyName: dto.agencyName,
        password:   hash,
        role:       "AGENT",
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const tokens = await this.signTokens(user.id, user.email, user.role);
    return { user, tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.active) throw new UnauthorizedException("Invalid credentials");

    const pwMatch = await argon2.verify(user.password, dto.password);
    if (!pwMatch) throw new UnauthorizedException("Invalid credentials");

    const tokens = await this.signTokens(user.id, user.email, user.role);
    const { password: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async getMe(userId: string) {
    if (!userId) throw new UnauthorizedException("Not authenticated");
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        agencyName: true, bio: true, verified: true, avatarUrl: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateProfile(userId: string, dto: { name?: string; phone?: string; agencyName?: string }) {
    if (!userId) throw new UnauthorizedException("Not authenticated");
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name       && { name: dto.name }),
        ...(dto.phone      && { phone: dto.phone }),
        ...(dto.agencyName !== undefined && { agencyName: dto.agencyName }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true, agencyName: true, bio: true, verified: true, avatarUrl: true, createdAt: true },
    });
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!userId) throw new UnauthorizedException("Not authenticated");
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const match = await argon2.verify(user.password, currentPassword);
    if (!match) throw new BadRequestException("Current password is incorrect");

    if (newPassword.length < 8) throw new BadRequestException("New password must be at least 8 characters");

    const hash = await argon2.hash(newPassword);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hash } });
    return { changed: true };
  }

  private async signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret:    this.config.get("JWT_SECRET"),
        expiresIn: this.config.get("JWT_ACCESS_EXPIRES", "1d"),
      }),
      this.jwt.signAsync(payload, {
        secret:    this.config.get("JWT_SECRET"),
        expiresIn: this.config.get("JWT_REFRESH_EXPIRES", "7d"),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
