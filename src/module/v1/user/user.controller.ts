import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query, Req,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserByEmailDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './user.service';
import {
  ADMIN_SEEDER,
  LOGGED_OUT,
  PASSWORD_UPDATED,
  RoleEnum, USER_UPDATE_PARENTAL_GUIDE,
  USER_UPDATED,
} from '../../../common/constants/user.constants';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Public } from '../../../common/decorator/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async findCurrentUser(@Request() req): Promise<UserDocument> {
    return await this.userService.findById(req.user);
  }

  @Get()
  async userByEmail(
    @Query() userByEmailDto: UserByEmailDto,
  ): Promise<UserDocument> {
    return await this.userService.findUserByEmail(userByEmailDto.email);
  }

  @ResponseMessage(USER_UPDATED)
  @Patch('me')
  async update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return await this.userService.update(req.user._id, updateUserDto);
  }

  @ResponseMessage(LOGGED_OUT)
  @Post('logout')
  async logout(@Request() req) {
    await this.userService.logout(req.user);
    return null;
  }

  @Public()
  @ResponseMessage(ADMIN_SEEDER)
  @Post('admin/seeder')
  async seedAdmin() {
    return await this.userService.seedAdmin();
  }

  @ResponseMessage(PASSWORD_UPDATED)
  @Patch('update/password')
  async changePassword(@Body() requestData: ChangePasswordDto, @Request() req) {
    await this.userService.changePassword(requestData, req.user);
    return null;
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async count() {
    return await this.userService.count();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async find(@Query() filter) {
    return await this.userService.paginate(filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @ResponseMessage(USER_UPDATED)
  @Patch('/find')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async updateSpecific(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return await this.userService.update(updateUserDto._id, updateUserDto);
  }

  @ResponseMessage(USER_UPDATE_PARENTAL_GUIDE)
  @Patch('/update/parental/guide')
  async setUserParentalGuide(@Body() requestData, @Req() req) {
    return await this.userService.setUserParentalGuide(requestData, req.user);
  }

}
