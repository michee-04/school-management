import { Injectable } from '@nestjs/common';

import { ErrorResult } from '@app/common/utils';
import { FilterQuery } from '@app/core-app/providers/base.mongo.repository';
import { StringUtils } from '@app/core-app/types';
import { SmsTemplate } from '../../infrastructure/models/smsTemplate';
import { SmsTemplateRepository } from '../../infrastructure/repositories/smsTemplate.repository';

@Injectable()
export class SmsTemplateService {
  constructor(private readonly smsTemplateRepository: SmsTemplateRepository) {}

  async create(input: Partial<SmsTemplate>) {
    await this.validateData(input);

    return this.smsTemplateRepository.create(input);
  }

  async update(id: string, data: Partial<SmsTemplate>) {
    await this.validateData(data, id);

    const template = await this.getById(id);
    Object.assign(template, { ...data });

    return this.smsTemplateRepository.update(template);
  }

  async delete(id: string) {
    const template = await this.getById(id);

    template.active = false;
    template.deleted = true;
    template.deletedAt = new Date();

    return this.smsTemplateRepository.update(template);
  }

  async getById(id: string) {
    const template = await this.smsTemplateRepository.getById(id);

    if (!template) {
      throw new ErrorResult({
        code: 404_002,
        clean_message: 'Le modèle de SMS est introuvable',
        message: `Le modèle de SMS [${id}] est introuvable`,
      });
    }

    return template;
  }

  async activate(id: string) {
    const template = await this.getById(id);
    if (!template.active && !template.deleted) {
      template.active = true;
      await this.smsTemplateRepository.update(template);
    }

    return template;
  }

  async deactivate(id: string) {
    const template = await this.getById(id);
    if (template.active && !template.deleted) {
      template.active = false;
      await this.smsTemplateRepository.update(template);
    }

    return template;
  }

  private async validateData(data: Partial<SmsTemplate>, id?: string) {
    const { label } = data;

    if (label) {
      const slug = StringUtils.slugify(label);

      const filter: FilterQuery<SmsTemplate> = { slug };
      if (id) {
        filter._id = { $ne: id };
      }

      const template = await this.smsTemplateRepository.getOne(filter);

      if (template) {
        throw new ErrorResult({
          code: 409_002,
          clean_message: 'Un modèle de SMS ayant la même nom existe déjà',
          message: 'Un modèle de SMS ayant le même [label] existe déjà',
        });
      }

      Object.assign(data, { slug });
    }
  }
}
