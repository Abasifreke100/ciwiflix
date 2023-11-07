import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SubCategory } from '../../category/schema/sub-category.schema';

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

  @Prop()
  subTitle: string;

  @Prop({ required: true })
  video: string;

  @Prop({ default: false })
  isReported: boolean;

  @Prop()
  feedback: string;

  @Prop()
  parentalGuide: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: SubCategory.name })
  subCategory?: SubCategory;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
