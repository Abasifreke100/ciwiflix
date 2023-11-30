import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { environment } from './common/config/environment';
import { AuthModule } from './module/v1/auth/auth.module';
import { MailModule } from './module/v1/mail/mail.module';
import { OtpModule } from './module/v1/otp/otp.module';
import { TokenModule } from './module/v1/token/token.module';
import { UserModule } from './module/v1/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { CategoryModule } from './module/v1/category/category.module';
import { MovieModule } from './module/v1/movie/movie.module';
import { UserListModule } from './module/v1/user-list/user-list.module';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // MulterModule.register({
    //   limits: {
    //     fileSize: 1024 * 1024 * 500, // Adjust the limit value as needed (400MB in this case)
    //   },
    // }),
    ThrottlerModule.forRoot({
      ttl: 5, //seconds
      limit: 1,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: environment.DB.URL,
        keepAlive: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    OtpModule,
    MailModule,
    TokenModule,
    CategoryModule,
    MovieModule,
    UserListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
