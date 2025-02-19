import { Module } from '@nestjs/common';
import { CoreAppService } from './core-app.service';

@Module({
  providers: [CoreAppService],
  exports: [CoreAppService],
})
export class CoreAppModule {}
