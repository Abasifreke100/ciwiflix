import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schema/movie.schema';
import { SpacesModule } from '../spaces/spaces.module';
import { SaveMovie, SaveMovieSchema } from './schema/save-movie.schema';
import {
  SubCategory,
  SubCategorySchema,
} from '../category/schema/sub-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: SaveMovie.name, schema: SaveMovieSchema },
    ]),
    SpacesModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
