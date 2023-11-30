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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Public } from '../../../common/decorator/public.decorator';
import { MovieService } from './movie.service';
import {
  MOVIE_CREATED,
  MOVIE_DELETED,
  MOVIE_FETCH,
  MOVIE_REMOVED,
  MOVIE_REPORT,
  MOVIE_SAVE,
  MOVIE_UPDATED,
  MOVIE_VIEWED,
} from '../../../common/constants/movie.constants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { Multer } from 'multer';
import * as Multer from 'multer';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ResponseMessage(MOVIE_CREATED)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'subTitle', maxCount: 1 },
    ]),
  )
  async create(
    @Body() requestData,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
      subTitle?: Express.Multer.File[];
    },
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
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.movieService.delete(id);
  }

  @ResponseMessage(MOVIE_UPDATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'subTitle', maxCount: 1 },
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
      subTitle?: Express.Multer.File[];
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

  @ResponseMessage(MOVIE_SAVE)
  @Post('save/:id')
  async saveMovie(@Param('id') id: string, @Req() req) {
    return await this.movieService.saveMovie(id, req.user);
  }

  @ResponseMessage(MOVIE_FETCH)
  @Get('save')
  async listSaveMovie(@Query() queryData, @Req() req) {
    return await this.movieService.listSaveMovie(queryData, req.user);
  }

  @ResponseMessage(MOVIE_REMOVED)
  @Delete('save/:id')
  async removeSaveMovie(@Param('id') id: string) {
    return await this.movieService.removeSaveMovie(id);
  }

  @ResponseMessage(MOVIE_FETCH)
  @Get('parental-guide')
  async getMovieByParentalGuide(@Query() query, @Req() req) {
    return await this.movieService.getMovieByParentalGuide(query, req.user);
  }

  @ResponseMessage(MOVIE_VIEWED)
  @Public()
  @Patch('update/view/count/:id')
  async updateViewMovieCount(@Param('id') id: string) {
    return await this.movieService.updateViewMovieCount(id);
  }
}
