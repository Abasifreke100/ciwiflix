import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';

export type UserListDocument = UserList &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class UserList {
  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;
}

export const UserListSchema = SchemaFactory.createForClass(UserList);
