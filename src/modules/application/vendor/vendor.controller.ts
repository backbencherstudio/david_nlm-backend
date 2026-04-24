import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role/roles.guard';
import { VendorService } from './vendor.service';
import { memoryStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard,RolesGuard) 
@Controller('vendor')
export class VendorController {
 
  constructor(private readonly vendorService: VendorService) {}
 
  // create business,pakage and day 
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'business_cover_photo', maxCount: 1 },
        { name: 'portfolio_files', maxCount: 1 },
        { name: 'package_image', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  async create(
    @Req() req,
    @Body() createVendorDto: CreateVendorDto,
    @UploadedFiles()
    files?: {
      business_cover_photo?: Express.Multer.File[];
      portfolio_files?: Express.Multer.File[];
      package_image?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.userId; 

    const businessCoverPhoto = files?.business_cover_photo?.[0];
    const portfolioFile = files?.portfolio_files?.[0];
    const packageImage = files?.package_image?.[0];

    return this.vendorService.create(
      createVendorDto,
       userId,
       businessCoverPhoto,
       portfolioFile,
       packageImage,
      );
  }

  // find all business
  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  
  


}
