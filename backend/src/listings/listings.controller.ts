import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFiles, HttpCode, HttpStatus,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { ListingsService } from "./listings.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { SearchListingDto } from "./dto/search-listing.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@ApiTags("Properties")
@Controller("properties")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: "Search / filter properties" })
  async search(@Query() dto: SearchListingDto) {
    return this.listingsService.search(dto);
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured properties" })
  async featured() {
    const data = await this.listingsService.getFeatured();
    return { success: true, data };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get property by ID" })
  async getById(@Param("id") id: string) {
    const data = await this.listingsService.getById(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new listing (Agent only)" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("images", 8))
  async create(
    @CurrentUser("sub") agentId: string,
    @Body() dto: CreateListingDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const data = await this.listingsService.create(agentId, dto, files);
    return { success: true, data };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a listing (Agent/Admin)" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("images", 8))
  async update(
    @Param("id") id: string,
    @CurrentUser("sub") agentId: string,
    @CurrentUser("role") role: string,
    @Body() dto: CreateListingDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const data = await this.listingsService.update(id, agentId, role, dto, files);
    return { success: true, data };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param("id") id: string,
    @CurrentUser("sub") agentId: string,
    @CurrentUser("role") role: string,
  ) {
    const data = await this.listingsService.delete(id, agentId, role);
    return { success: true, data };
  }

  @Post(":id/view")
  @HttpCode(HttpStatus.OK)
  async incrementView(@Param("id") id: string) {
    await this.listingsService.incrementView(id);
    return { success: true };
  }

  @Post(":id/report")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async report(
    @Param("id") id: string,
    @CurrentUser("sub") reporterId: string,
    @Body("reason") reason: string,
  ) {
    const data = await this.listingsService.report(id, reporterId, reason);
    return { success: true, data };
  }
}
