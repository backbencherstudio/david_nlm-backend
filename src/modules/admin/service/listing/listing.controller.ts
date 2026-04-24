import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { Role } from 'src/common/guard/role/role.enum';
import { Roles } from 'src/common/guard/role/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  async create(@Body() createListingDto: CreateListingDto) {
    return this.listingService.create(createListingDto);
  }

  @Get()
  async findAll() {
    return this.listingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingService.remove(id);
  }

  /*-----------------------------------------
          dashborad service management
  -----------------------------------------*/

  // all service dashboard
  @Get('dashboard/all-service')
  async getAllServiceDashboard() {
    return this.listingService.getAllServiceDashboard();
  }

  // action dashboard service status update
  @Patch('dashboard/status/:id')
  async updateServiceStatus(
    @Param('id') id: string,
    @Body('status') status: number,
  ) {
    return this.listingService.updateServiceStatus(id, status);
  }
}
