import {
  IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "Jane Wanjiku" })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "0712345678" })
  @Matches(/^(?:\+254|0)[17]\d{8}$/, { message: "Enter a valid Kenyan phone number" })
  phone: string;

  @ApiPropertyOptional({ example: "Kamau Realtors Ltd" })
  @IsOptional()
  @IsString()
  agencyName?: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @Length(8, 72)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
