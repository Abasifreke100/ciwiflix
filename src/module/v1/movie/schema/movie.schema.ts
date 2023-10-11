import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Category } from '../../category/schema/category.schema';

export type MovieDocument = Movie &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({ required: true })
  video: string;

  @Prop({ default: false })
  isReported: boolean;

  @Prop()
  feedback: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category?: Category;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
