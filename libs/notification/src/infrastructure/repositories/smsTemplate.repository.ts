import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { SmsTemplate } from '../models/smsTemplate';

@Injectable()
export class SmsTemplateRepository extends BaseRepository<SmsTemplate> {
  constructor(
    @InjectModel(SmsTemplate.name, MAIN_DATABASE_CONNECTION_NAME)
    readonly model: Model<SmsTemplate>,
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
