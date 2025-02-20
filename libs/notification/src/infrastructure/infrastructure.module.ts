import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { LibCoreAppModule } from '@app/core-app';
import { ModelsMainProviders } from './models';
import { EmailTemplateRepository } from './repositories/emailTemplate.repository';
import { SmsTemplateRepository } from './repositories/smsTemplate.repository';
import { UserNotificationRepository } from './repositories/userNotification.repository';
import { NotifyService } from './services/notify.service';

@Module({
  imports: [
    LibCoreAppModule,
    MongooseModule.forFeature(
      ModelsMainProviders,
      MAIN_DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [
    EmailTemplateRepository,
    SmsTemplateRepository,
    UserNotificationRepository,
    NotifyService,
  ],
  exports: [
    EmailTemplateRepository,
    SmsTemplateRepository,
    UserNotificationRepository,
    NotifyService,
  ],
})
export class LibNotificationInfrastructureModule {}
