import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListingService {
  constructor(private prisma: PrismaService) {}

  async create(createListingDto: CreateListingDto) {
    const {
      name,
      category_id,
      sub_category_ids,
      operated_by,
      working_type,
      commission,
    } = createListingDto;

    const category = await this.prisma.serviceCategory.findUnique({
      where: { id: category_id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }

    if (sub_category_ids && sub_category_ids.length > 0) {
      const subcategories = await this.prisma.serviceSubCategory.findMany({
        where: { id: { in: sub_category_ids } },
      });

      if (subcategories.length !== sub_category_ids.length) {
        throw new NotFoundException('One or more subcategories not found');
      }

      const invalidSubcategory = subcategories.find(
        (sub) => sub.category_id !== category_id,
      );
      if (invalidSubcategory) {
        throw new ConflictException(
          'All subcategories must belong to the selected category',
        );
      }
    }

    const service = await this.prisma.service.create({
      data: {
        name,
        category_id,
        operated_by,
        working_type,
        commission,
        sub_categories:
          sub_category_ids && sub_category_ids.length > 0
            ? {
                create: sub_category_ids.map((sub_category_id) => ({
                  sub_category: { connect: { id: sub_category_id } },
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        sub_categories: {
          include: { sub_category: true },
        },
      },
    });

    return {
      success: true,
      message: 'Service created successfully',
      data: service,
    };
  }

  async findAll() {
    const services = await this.prisma.service.findMany({
      include: {
        category: true,
        sub_categories: {
          include: { sub_category: true },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      success: true,
      message: 'Services retrieved successfully',
      data: services,
    };
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        sub_categories: {
          include: { sub_category: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Service retrieved successfully',
      data: service,
    };
  }

  async update(id: string, updateListingDto: UpdateListingDto) {
  
    const { name, operated_by, working_type, commission } = updateListingDto;

    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: {
        name,
        operated_by,
        working_type,
        commission,
      },
      include: {
        category: true,
        sub_categories: {
          include: {
            sub_category: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Service updated successfully',
      data: updatedService,
    };
  }

  async remove(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Service deleted successfully',
    };
  }
}
