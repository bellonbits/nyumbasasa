import {
  IsEnum, IsNumber, IsOptional, IsString, Min, Max, IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { HouseType } from "@prisma/client";

export class SearchListingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  town?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estate?: string;

  @ApiPropertyOptional({ enum: HouseType })
  @IsOptional()
  @IsEnum(HouseType)
  houseType?: HouseType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minRent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxRent?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 12;

  @ApiPropertyOptional({ enum: ["createdAt", "rent", "viewCount"] })
  @IsOptional()
  @IsIn(["createdAt", "rent", "viewCount"])
  sortBy?: "createdAt" | "rent" | "viewCount" = "createdAt";

  @ApiPropertyOptional({ enum: ["asc", "desc"] })
  @IsOptional()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
