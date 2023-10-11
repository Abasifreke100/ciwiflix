import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CategoryEnum } from '../../../../common/constants/product.constants';

export type ProductDocument = Product &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  productDetails: string;

  @Prop()
  colors: [];

  @Prop()
  tags: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: [];

  @Prop()
  sizes: [];

  @Prop()
  quantity: number;

  @Prop({
    enum: [CategoryEnum.MEN, CategoryEnum.WOMEN],
  })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
