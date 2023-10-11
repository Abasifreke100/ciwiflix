import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';

import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../../common/decorator/roles.decorator';
import { RoleEnum } from '../../../common/constants/user.constants';
import { Public } from '../../../common/decorator/public.decorator';
import {
  CATEGORY_CREATED,
  CATEGORY_DELETED,
  CATEGORY_FETCH,
  CATEGORY_UPDATED,
} from '../../../common/constants/category.constants';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ResponseMessage(CATEGORY_CREATED)
  @Public()
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN)
  async create(@Body() requestData) {
    return await this.categoryService.create(requestData);
  }

  @ResponseMessage(CATEGORY_FETCH)
  @Public()
  @Get()
  async paginate() {
    return await this.categoryService.paginate();
  }

  @ResponseMessage(CATEGORY_DELETED)
  @Public()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }

  @ResponseMessage(CATEGORY_UPDATED)
  @Public()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData) {
    return await this.categoryService.update(id, requestData);
  }
}
