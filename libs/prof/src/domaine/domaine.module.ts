import { CommonModule } from '@app/common';
import { LibNotificationInfrastructureModule } from '@app/notification/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { LibProfInfrastructureModule } from '../infrastructure/infrastructure.module';
import { OtpService } from './service/otp.service';
import { UserService } from './service/user.service';

@Module({
  imports: [
    LibProfInfrastructureModule,
    LibNotificationInfrastructureModule,
    CommonModule,
  ],
  providers: [UserService, OtpService],
  exports: [UserService, OtpService],
})
export class LibProfDomaineModule {}
