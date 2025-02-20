import { ModelDefinition } from '@nestjs/mongoose';

import { EmailTemplate, EmailTemplateSchema } from './emailTemplate';
import { SmsTemplate, SmsTemplateSchema } from './smsTemplate';
import { UserNotification, UserNotificationSchema } from './userNotification';

export const ModelsMainProviders: ModelDefinition[] = [
  { name: EmailTemplate.name, schema: EmailTemplateSchema },
  { name: SmsTemplate.name, schema: SmsTemplateSchema },
  { name: UserNotification.name, schema: UserNotificationSchema },
];
