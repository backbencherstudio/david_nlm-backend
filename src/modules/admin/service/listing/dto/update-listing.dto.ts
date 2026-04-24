import { PartialType, PickType } from '@nestjs/swagger';
import { CreateListingDto } from './create-listing.dto';

export class UpdateListingDto extends PartialType(
  PickType(CreateListingDto, [
    'name',
    'operated_by',
    'working_type',
    'commission',
  ] as const),
) {}