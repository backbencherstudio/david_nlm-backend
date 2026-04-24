import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StringHelper } from 'src/common/helper/string.helper';
import appConfig from 'src/config/app.config';
import { TanvirStorage } from 'src/common/lib/Disk/TanvirStorage';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async create(
    createVendorDto: CreateVendorDto,
    userId: string,
    CoverPhoto?: Express.Multer.File,
    portfolioFiles?: Express.Multer.File,
    packageImage?: Express.Multer.File,
  ) {
    const { package: pkg, day, ...businessData } = createVendorDto;

    const data: any = {};

    if (CoverPhoto) {
      const businessCoverPhoto = `${StringHelper.randomString()}_${CoverPhoto.originalname}`;

      await TanvirStorage.put(
        appConfig().storageUrl.business + '/' + businessCoverPhoto,
        CoverPhoto.buffer,
      );

      data.business_cover_photo = businessCoverPhoto;
    }

    if (portfolioFiles) {
      const portfolioFileName = `${StringHelper.randomString()}_${portfolioFiles.originalname}`;
      await TanvirStorage.put(
        appConfig().storageUrl.business + '/' + portfolioFileName,
        portfolioFiles.buffer,
      );
      data.portfolio_files = portfolioFileName;
    }

    if (packageImage) {
      const packageImageName = `${StringHelper.randomString()}_${packageImage.originalname}`;
      await TanvirStorage.put(
        appConfig().storageUrl.package + '/' + packageImageName,
        packageImage.buffer,
      );
      data.package_image = packageImageName;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          business_name: businessData.business_name,
          business_description: businessData.business_description,
          business_cover_photo: data.business_cover_photo,
          business_note: businessData.business_note,
          category_id: businessData.category_id,
          sub_category_id: businessData.sub_category_id,
          OPERATED_BY: businessData.OPERATED_BY,
          specialties: businessData.specialties,
          service_area: businessData.service_area,
          portfolio_files: data.portfolio_files,
          user_id: userId,
        },
      });

      if (pkg) {
        await tx.package.create({
          data: {
            package_name: pkg.package_name,
            package_description: pkg.package_summary,
            package_image: data.package_image,
            side_choices: pkg.side_choices,
            notes: pkg.notes,
            service_price: pkg.service_price,
            business_id: business.id,
          },
        });
      }

      if (day) {
        await tx.day.create({
          data: {
            day_name: day.day_name,
            start_time: day.start_time,
            end_time: day.end_time,
            intra_service_interval_hours: day.intra_service_interval_hours,
            intra_service_interval_minutes: day.intra_service_interval_minutes,
            business_id: business.id,
          },
        });
      }

      return business;
    });

    return {
      success: true,
      message: 'Business created successfully',
      data: result,
    };
  }

 
  async findAll() {
    const businesses = await this.prisma.business.findMany({
      include: {
        category: true,
        sub_category: true,
        packages: true,
        days: true,
      },
    });
    return {
      success: true,
      message: 'Businesses found successfully',
      data: businesses,
    };
}

}
