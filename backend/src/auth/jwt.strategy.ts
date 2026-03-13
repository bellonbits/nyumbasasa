import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

export interface JwtPayload {
  sub:   string;
  email: string;
  role:  string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly config:  ConfigService,
    private readonly prisma:  PrismaService,
  ) {
    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:      config.get<string>("JWT_SECRET")!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where:  { id: payload.sub },
      select: { id: true, email: true, role: true, active: true },
    });
    if (!user || !user.active) throw new UnauthorizedException("Account not found or disabled");
    return user;
  }
}
