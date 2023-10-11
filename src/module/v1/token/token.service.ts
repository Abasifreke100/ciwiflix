import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateIdentifier } from 'src/common/utils/uniqueId';
import { UserDocument } from '../user/schema/user.schema';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token, TokenDocument } from './schema/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  async create({ user, token }: CreateTokenDto) {
    return await this.tokenModel.findOneAndUpdate(
      { user },
      { token },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  async findOne(payload: CreateTokenDto) {
    const authorize = await this.tokenModel.findOne(payload);
    return authorize;
  }

  async clear() {
    return await this.tokenModel.findOneAndRemove({ user: null });
  }

  async logout(id: string) {
    return await this.tokenModel.findOneAndRemove({ user: id });
  }

  async generateNewToken(currentUser: UserDocument) {
    const accessToken = this.jwtService.sign({
      _id: currentUser._id,
      role: currentUser.role,
      generator: generateIdentifier(),
    });
    await this.create({ user: currentUser._id, token: accessToken });
    return accessToken;
  }

  async createOrUpdateToken(requestData: CreateTokenDto) {
    try {
      const existingToken = await this.tokenModel.findOne({
        user: requestData.user,
      });

      if (existingToken) {
        Object.assign(existingToken, requestData);
        await existingToken.save();
      } else {
        await this.tokenModel.create({ ...requestData });
      }
    } catch (error) {
      console.error('Error creating or updating token:', error);
      throw error;
    }
  }
}
