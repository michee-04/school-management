import { Module } from '@nestjs/common';

import { LibNotificationInfrastructureModule } from '../infrastructure/infrastructure.module';
import { EmailTemplateService } from './services/emailTemplate.service';
import { SmsTemplateService } from './services/smsTemplate.service';
import { UserNotificationService } from './services/userNotification.service';

@Module({
  imports: [LibNotificationInfrastructureModule],
  providers: [
    EmailTemplateService,
    SmsTemplateService,
    UserNotificationService,
  ],
  exports: [EmailTemplateService, SmsTemplateService, UserNotificationService],
})
export class LibNotificationDomainModule {}
