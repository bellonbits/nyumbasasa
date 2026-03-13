import {
  Controller, Post, Get, Patch, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser } from "./current-user.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new agent account" })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { success: true, data };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login and get JWT tokens" })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return { success: true, data };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  async me(@CurrentUser("sub") userId: string) {
    const data = await this.authService.getMe(userId);
    return { success: true, data };
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user profile" })
  async updateProfile(
    @CurrentUser("sub") userId: string,
    @Body() dto: { name?: string; phone?: string; agencyName?: string },
  ) {
    const data = await this.authService.updateProfile(userId, dto);
    return { success: true, data };
  }

  @Patch("password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change current user password" })
  async changePassword(
    @CurrentUser("sub") userId: string,
    @Body() dto: { currentPassword: string; newPassword: string },
  ) {
    const data = await this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
    return { success: true, data };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { success: true, message: "Logged out" };
  }
}
