import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestGuard } from './common/utils/guards';
import { TransformationInterceptor } from './common/interceptor/response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import { HttpExceptionFilter } from './common/filter/filter';
import { config } from 'dotenv';
config();
import helmet from 'helmet';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as timeout from 'connect-timeout';
import { TimeoutExceptionFilter } from './common/interceptor/timeout.exception-filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.use(timeout('10s'));
  app.use(helmet());
  app.use(compression());
  // app.use(bodyParser.json({ limit: '500mb' }));
  // app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  // app.use(express.json({ limit: '500mb' }));
  // app.use(express.urlencoded({ limit: '500mb', extended: true }));

  // guards
  app.useGlobalGuards(new RequestGuard());

  // interceptors
  app.useGlobalInterceptors(
    new TransformationInterceptor(app.get(Reflector)),
    new TimeoutInterceptor(),
  );

  // app.useGlobalFilters(new TimeoutExceptionFilter());

  // filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // prefix
  app.setGlobalPrefix('/api/v1');

  // pipeline validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
