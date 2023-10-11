import {
  Body,
  Controller,
  Post,
  Req,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OTP_SENT } from 'src/common/constants/otp.constants';
import { OtpEnum } from 'src/common/constants/otp.enum';
import {
  FORGOT_PWD_RESET,
  LOGGED_IN,
  USER_CREATED,
} from 'src/common/constants/user.constants';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseMessage } from 'src/common/decorator/response.decorator';
import { OtpService } from '../otp/otp.service';
import { AuthDto, CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CheckEmailDto, LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ForgotPasswordResetDto } from './dto/password.dto';
import { IAuthResponse } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private otpService: OtpService,
  ) {}

  // @Public()
  // @Post()
  // @ResponseMessage(USER_CREATED)
  // async register(
  //   @Body() requestPayload: CreateUserDto,
  // ): Promise<IAuthResponse> {
  //   return await this.authService.register(requestPayload);
  // }

  @Public()
  @Post('login')
  @ResponseMessage(LOGGED_IN)
  async login(
    @Body() requestPayload: LoginDto,
    @Req() req,
  ): Promise<IAuthResponse> {
    const data = await this.authService.login(requestPayload);

    return JSON.parse(JSON.stringify(data));
  }

  @Public()
  @Post('password/forgot')
  @ResponseMessage(OTP_SENT)
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    await this.otpService.sendOtpForExistingUsers(email, OtpEnum.PASSWORD);
    return;
  }

  @Public()
  @Post('email/check')
  @ResponseMessage(OTP_SENT)
  async checkEmail(@Body() { email }: CheckEmailDto) {
    await this.authService.checkEmail(email);
    return;
  }

  @Public()
  @Post('password/reset')
  @ResponseMessage(FORGOT_PWD_RESET)
  async forgotPasswordReset(@Body() requestData: ForgotPasswordResetDto) {
    await this.authService.resetPassword(requestData);
    return;
  }

  @Public()
  @ResponseMessage(LOGGED_IN)
  @Post()
  async auth(@Body() requestData: AuthDto) {
    try {
      return await this.authService.auth(requestData);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
