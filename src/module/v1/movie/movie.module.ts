import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schema/movie.schema';
import { SpacesModule } from '../spaces/spaces.module';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { SaveMovie, SaveMovieSchema } from './schema/save-movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SaveMovie.name, schema: SaveMovieSchema },
    ]),
    SpacesModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
