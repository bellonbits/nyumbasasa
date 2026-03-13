import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { LocationsService } from "./locations.service";

@ApiTags("Locations")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get("counties")
  @ApiOperation({ summary: "Get all counties with listing counts" })
  async getCounties() {
    const data = await this.locationsService.getCounties();
    return { success: true, data };
  }

  @Get("counties/:id/towns")
  @ApiOperation({ summary: "Get towns in a county" })
  async getTowns(@Param("id") countyId: string) {
    const data = await this.locationsService.getTowns(countyId);
    return { success: true, data };
  }

  @Get("towns/:id/estates")
  @ApiOperation({ summary: "Get estates in a town" })
  async getEstates(@Param("id") townId: string) {
    const data = await this.locationsService.getEstates(townId);
    return { success: true, data };
  }
}
