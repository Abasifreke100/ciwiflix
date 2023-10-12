import { Module } from '@nestjs/common';
import { UserListController } from './user-list.controller';
import { UserListService } from './user-list.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserList, UserListSchema } from './schema/user-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserList.name, schema: UserListSchema },
    ]),
  ],
  controllers: [UserListController],
  providers: [UserListService],
})
export class UserListModule {}
