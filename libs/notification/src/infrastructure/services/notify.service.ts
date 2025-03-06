import { AppConfig } from '@app/core-app/config';
import { MailService } from '@app/core-app/services/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import { Attachment } from 'nodemailer/lib/mailer';
import { EmailTemplateRepository } from '../repositories/emailTemplate.repository';
import { UserNotificationRepository } from '../repositories/userNotification.repository';

@Injectable()
export class NotifyService {
  private readonly isEmailEnabled: boolean = false;
  private readonly appName: string;

  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly mailService: MailService,
    private readonly emailTemplateRepository: EmailTemplateRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {
    this.isEmailEnabled = this.config.get('LIB_NOTIFICATION_EMAIL_ENABLED', {
      infer: true,
    });
    this.appName = this.config.get('GLOBAL_APP_NAME', { infer: true });
  }

  async notifyByEmail(
    slug: string,
    payload: Record<string, any>,
    recipients: string | string[],
    userId?: string,
    attachments?: Attachment[],
  ) {
    if (!this.isEmailEnabled) return null;

    const template = await this.emailTemplateRepository.getActiveBySlug(slug);

    if (!template) return null;

    let subject = this.appName;
    if (template.subject) {
      subject = Handlebars.compile(template.subject)(payload);
    }

    let message = '';
    if (template.message) {
      message = Handlebars.compile(template.message)(payload);
    }

    const html = Handlebars.compile(template.template)(payload);

    if (userId && message) {
      this.userNotificationRepository
        .create({ userId, message })
        .catch(console.error);
    }

    return this.mailService
      .send({
        subject,
        html,
        text: message,
        to: recipients,
        attachments,
      })
      .catch(console.error);
  }
}
