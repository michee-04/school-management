import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { LibProfModule } from '@app/prof';
import { AuthController } from './controller/user.controller';
import { ExpectionHandlerFilter } from './interceptors/exceptions/handler';
import { WrapResponseInterceptor } from './interceptors/response/wrap.interceptor';

@Module({
  imports: [LibProfModule],
  controllers: [AuthController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
    { provide: APP_FILTER, useClass: ExpectionHandlerFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
  ],
})
export class CoreModule {}
