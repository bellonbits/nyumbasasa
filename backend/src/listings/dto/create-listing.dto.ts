import {
  IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, Min, IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { HouseType } from "@prisma/client";

export class CreateListingDto {
  @ApiProperty({ example: "Spacious Bedsitter near Westgate" })
  @IsString()
  @Length(10, 200)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(30, 3000)
  description: string;

  @ApiProperty({ example: 8000 })
  @Type(() => Number)
  @IsNumber()
  @Min(500)
  rent: number;

  @ApiProperty({ example: 8000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deposit: number;

  @ApiProperty({ enum: HouseType })
  @IsEnum(HouseType)
  houseType: HouseType;

  @ApiProperty({ description: "County UUID" })
  @IsString()
  county: string;

  @ApiProperty({ description: "Town name or UUID" })
  @IsString()
  town: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenityIds?: string[];
}
