import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailTemplate } from '../models/emailTemplate';

@Injectable()
export class EmailTemplateRepository extends BaseRepository<EmailTemplate> {
  constructor(
    @InjectModel(EmailTemplate.name, MAIN_DATABASE_CONNECTION_NAME)
    readonly model: Model<EmailTemplate>,
  ) {
    super(model);
  }

  async getBySlug(slug: string) {
    return this.getOne({ slug });
  }

  async getActiveBySlug(slug: string) {
    return this.getOne({ slug, active: true, deleted: false });
  }
}
