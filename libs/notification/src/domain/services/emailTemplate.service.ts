import { Injectable } from '@nestjs/common';

import { ErrorResult } from '@app/common/utils';
import { FilterQuery } from '@app/core-app/providers/base.mongo.repository';
import { StringUtils } from '@app/core-app/types';
import { EmailTemplate } from '../../infrastructure/models/emailTemplate';
import { EmailTemplateRepository } from '../../infrastructure/repositories/emailTemplate.repository';

@Injectable()
export class EmailTemplateService {
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async create(input: Partial<EmailTemplate>) {
    await this.validateData(input);

    return this.emailTemplateRepository.create(input);
  }

  async update(id: string, data: Partial<EmailTemplate>) {
    await this.validateData(data, id);

    const template = await this.getById(id);
    Object.assign(template, { ...data });

    return this.emailTemplateRepository.update(template);
  }

  async delete(id: string) {
    const template = await this.getById(id);

    template.active = false;
    template.deleted = true;
    template.deletedAt = new Date();

    return this.emailTemplateRepository.update(template);
  }

  async getById(id: string) {
    const template = await this.emailTemplateRepository.getById(id);

    if (!template) {
      throw new ErrorResult({
        code: 404_001,
        clean_message: "Le modèle d'email est introuvable",
        message: `Le modèle d'email [${id}] est introuvable`,
      });
    }

    return template;
  }

  async activate(id: string) {
    const template = await this.getById(id);
    if (!template.active && !template.deleted) {
      template.active = true;
      await this.emailTemplateRepository.update(template);
    }

    return template;
  }

  async deactivate(id: string) {
    const template = await this.getById(id);
    if (template.active && !template.deleted) {
      template.active = false;
      await this.emailTemplateRepository.update(template);
    }

    return template;
  }

  private async validateData(data: Partial<EmailTemplate>, id?: string) {
    const { label } = data;

    if (label) {
      const slug = StringUtils.slugify(label);

      const filter: FilterQuery<EmailTemplate> = { slug };
      if (id) {
        filter._id = { $ne: id };
      }

      const template = await this.emailTemplateRepository.getOne(filter);

      if (template) {
        throw new ErrorResult({
          code: 409_001,
          clean_message: "Un modèle d'email ayant le même nom existe déjà",
          message: "Un modèle d'email ayant le même [label] existe déjà",
        });
      }

      Object.assign(data, { slug });
    }
  }
}
