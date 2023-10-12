import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Movie } from './movie.schema';
import { User } from '../../user/schema/user.schema';

export type SaveMovieDocument = SaveMovie &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class SaveMovie {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Movie.name })
  movie?: Movie;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;
}

export const SaveMovieSchema = SchemaFactory.createForClass(SaveMovie);
