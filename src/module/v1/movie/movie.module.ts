import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schema/movie.schema';
import { SpacesModule } from '../spaces/spaces.module';
import { Category, CategorySchema } from '../category/schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    SpacesModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
