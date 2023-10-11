import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../../../../common/constants/user.constants';

export type UserDocument = User &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({
    unique: true,
    trim: true,
    lowercase: true,
    default: null,
    required: false,
  })
  email: string;

  @Prop({ default: null, required: false })
  phone: string;

  @Prop({
    enum: [RoleEnum.CUSTOMER, RoleEnum.ADMIN],
    default: RoleEnum.CUSTOMER,
  })
  role: string;

  @Prop({
    select: false,
    minlength: [6, 'Password must be a least 6 characters'],
  })
  password: string;

  @Prop({ unique: true, trim: true })
  wallet_id: string;

  @Prop({ default: null, required: false })
  wallet_type: string;

  @Prop({ default: 0 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
