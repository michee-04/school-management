import { LibCoreAppModule } from '@app/core-app';
import { LibNotificationModule } from '@app/notification';
import { LibProfModule } from '@app/prof';
import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';

@Module({
  imports: [LibProfModule, LibCoreAppModule, LibNotificationModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
