import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Public } from '../../../common/decorator/public.decorator';
import { MovieService } from './movie.service';
import {
  MOVIE_CREATED,
  MOVIE_DELETED,
  MOVIE_FETCH,
  MOVIE_REPORT,
  MOVIE_UPDATED,
} from '../../../common/constants/movie.constants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ResponseMessage(MOVIE_CREATED)
  @Public()
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RoleEnum.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async create(
    @Body() requestData,
    @UploadedFiles()
    files: { thumbnail?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ) {
    return await this.movieService.create(requestData, files);
  }

  @ResponseMessage(MOVIE_FETCH)
  @Public()
  @Get()
  async paginate(@Query() queryData, @Req() req) {
    return await this.movieService.paginate(queryData, req);
  }

  @ResponseMessage(MOVIE_DELETED)
  @Public()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.movieService.delete(id);
  }

  @ResponseMessage(MOVIE_UPDATED)
  @Public()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() requestData,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    return await this.movieService.update(id, requestData, files);
  }

  @ResponseMessage(MOVIE_REPORT)
  @Public()
  @Patch('report/:id')
  async reportVideo(@Param('id') id: string, @Body() requestData) {
    return await this.movieService.reportVideo(id, requestData);
  }

  @ResponseMessage(MOVIE_FETCH)
  @Public()
  @Get('reported')
  async listReportedMovie(@Query() queryData) {
    return await this.movieService.listReportedMovie(queryData);
  }

  @ResponseMessage(MOVIE_FETCH)
  @Public()
  @Get('display')
  async moviesForDisplay(@Query() queryData, @Req() req) {
    return await this.movieService.moviesForDisplay(queryData, req);
  }
}
