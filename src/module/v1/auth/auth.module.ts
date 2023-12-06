import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt.guard';
import { environment } from 'src/common/config/environment';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/auth.strategy';
import { OtpModule } from '../otp/otp.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    UserModule,
    OtpModule,
    PassportModule,
    TokenModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    {
      ...JwtModule.register({
        secret: environment.JWT.SECRET,
        signOptions: { expiresIn: '1d' },
      }),
      global: true,
    },
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
