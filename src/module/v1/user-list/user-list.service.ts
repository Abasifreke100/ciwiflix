import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserList, UserListDocument } from './schema/user-list.schema';

@Injectable()
export class UserListService {
  constructor(
    @InjectModel(UserList.name) private userListModel: Model<UserListDocument>,
  ) {}

  async addToList(requestData, user) {
    const checkExistingName = await this.userListModel.findOne({
      title: requestData.title,
      user: user._id,
    });

    if (checkExistingName) {
      throw new BadRequestException('Video title already exist');
    }

    const userList = await this.userListModel.create({
      title: requestData.title,
      user: user._id,
    });

    return userList;
  }
  async myList(query: any, user) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 100;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.userListModel.count({ user: user._id });
    const response = await this.userListModel
      .find({ user: user._id })
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort });

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }
  async removeFromList(id) {
    const userList = await this.userListModel.findByIdAndDelete({
      _id: id,
    });

    if (!userList) {
      throw new NotFoundException('List not found');
    }

    return;
  }
}
