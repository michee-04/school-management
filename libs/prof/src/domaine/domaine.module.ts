import { LibNotificationInfrastructureModule } from '@app/notification/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { LibProfInfrastructureModule } from '../infrastructure/infrastructure.module';
import { UserService } from './service/user.service';

@Module({
  imports: [LibProfInfrastructureModule, LibNotificationInfrastructureModule],
  providers: [UserService],
  exports: [UserService],
})
export class LibProfDomaineModule {}
