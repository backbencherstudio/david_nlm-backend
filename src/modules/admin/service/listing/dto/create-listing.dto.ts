import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export enum WorkingTypeEnum {
	DAY = 'DAY',
	HOUR = 'HOUR',
}

export enum OperatedByEnum {
	REMOTE = 'REMOTE',
	ON_SITE = 'ON_SITE',
	HYBRID = 'HYBRID',
}

export class CreateListingDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	name: string;

	@IsString()
	@IsNotEmpty()
	category_id: string;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	sub_category_ids?: string[];

	@IsEnum(OperatedByEnum)
	operated_by: OperatedByEnum;

	@IsEnum(WorkingTypeEnum)
	working_type: WorkingTypeEnum;

	@IsNumber()
	@Min(0)
	@Transform(({ value }) => (value !== undefined ? parseFloat(value) : value))
	commission: number;
}
