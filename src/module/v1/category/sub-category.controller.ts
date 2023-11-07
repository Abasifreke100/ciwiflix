import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  SUBCATEGORY_CREATED,
  SUBCATEGORY_DELETED,
  SUBCATEGORY_FETCH,
  SUBCATEGORY_UPDATED,
} from '../../../common/constants/category.constants';
import { Public } from '../../../common/decorator/public.decorator';
import { SubCategoryService } from './sub-category.service';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @ResponseMessage(SUBCATEGORY_CREATED)
  @Public()
  @Post()
  async create(@Body() requestData) {
    return await this.subCategoryService.create(requestData);
  }

  @ResponseMessage(SUBCATEGORY_FETCH)
  @Public()
  @Get()
  async paginate() {
    return await this.subCategoryService.paginate();
  }

  @ResponseMessage(SUBCATEGORY_UPDATED)
  @Public()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData) {
    return await this.subCategoryService.update(id, requestData);
  }

  @ResponseMessage(SUBCATEGORY_DELETED)
  @Public()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.subCategoryService.delete(id);
  }
}
