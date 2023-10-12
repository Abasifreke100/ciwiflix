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
import { ProductModule } from './module/v1/product/product.module';
import { CartModule } from './module/v1/cart/cart.module';
import { PaymentModule } from './module/v1/payment/payment.module';
import { OrderModule } from './module/v1/order/order.module';
import { CategoryModule } from './module/v1/category/category.module';
import { MovieModule } from './module/v1/movie/movie.module';
import { UserListModule } from './module/v1/user-list/user-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    ProductModule,
    CartModule,
    PaymentModule,
    OrderModule,
    CategoryModule,
    MovieModule,
    UserListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
