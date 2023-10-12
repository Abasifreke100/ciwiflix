import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserListService } from './user-list.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  ADD_TO_LIST,
  LIST_FETCH,
  REMOVE_LIST,
} from '../../../common/constants/movie.constants';
import { ListDto } from './dto/list.dto';

@Controller('user-list')
export class UserListController {
  constructor(private readonly userListService: UserListService) {}

  @ResponseMessage(ADD_TO_LIST)
  @Post()
  async addToList(@Body() requestData: ListDto, @Req() req) {
    return await this.userListService.addToList(requestData, req.user);
  }

  @ResponseMessage(LIST_FETCH)
  @Get()
  async myList(@Query() queryData, @Req() req) {
    return await this.userListService.myList(queryData, req.user);
  }

  @ResponseMessage(REMOVE_LIST)
  @Delete(':id')
  async removeFromList(@Param('id') id: string) {
    return await this.userListService.removeFromList(id);
  }
}
