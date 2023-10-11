import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(requestData) {
    return await this.categoryModel.create({ name: requestData.name });
  }

  async paginate() {
    const response = await this.categoryModel
      .find()
      .sort({ createdAt: 'desc' });
    return response;
  }

  async delete(id) {
    const category = await this.categoryModel.findByIdAndDelete({
      _id: id,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return;
  }

  async update(id, requestData) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate(
        id,
        requestData,
        {
          new: true,
        },
      );

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
