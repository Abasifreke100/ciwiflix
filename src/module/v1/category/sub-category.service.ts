import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory, SubCategoryDocument } from './schema/sub-category.schema';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategoryDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(requestData) {
    const category = await this.categoryModel.findOne({
      _id: requestData.category,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const subCategory = await this.subCategoryModel.create({
      name: requestData.name,
      category: requestData.category,
    });

    return subCategory;
  }

  async paginate() {
    const response = await this.subCategoryModel
      .find()
      .populate('category')
      .sort({ createdAt: 'desc' });

    return response;
  }

  async delete(id) {
    const category = await this.subCategoryModel.findByIdAndDelete({
      _id: id,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return;
  }

  async update(id, requestData) {
    try {
      const category = await this.subCategoryModel.findByIdAndUpdate(
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
