import { IsString, IsOptional, IsArray, IsEnum, IsNumber, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessOperatedBy } from 'prisma/generated/enums';

class CreatePackageDto {
  @IsString() @IsOptional() package_name: string;
  @IsString() @IsOptional() package_summary: string;
  @IsString() @IsOptional() side_choices: string;
  @IsString() @IsOptional() notes: string;
  @IsNumber() @IsOptional() service_price: number;
}

class CreateDayDto {
  @IsString() day_name: string;
  @IsBoolean() @IsOptional() is_active: boolean;
  @IsString() @IsOptional() start_time: string;
  @IsString() @IsOptional() end_time: string;
  @IsNumber() @IsOptional() intra_service_interval_hours: number;
  @IsNumber() @IsOptional() intra_service_interval_minutes: number;
}

export class CreateVendorDto {
 
  @IsString() business_name: string;
  @IsString() @IsOptional() business_description: string;
  @IsString() @IsOptional() business_note: string;
  @IsString() @IsOptional() category_id: string;
  @IsString() @IsOptional() sub_category_id: string;
  @IsEnum(BusinessOperatedBy) @IsOptional() OPERATED_BY: BusinessOperatedBy;
  @IsString() @IsOptional() specialties: string;
  @IsString() @IsOptional() service_area: string;
 
  // ✅ Single object
   
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePackageDto)
  package?: CreatePackageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDayDto)
  day?: CreateDayDto;

  
}