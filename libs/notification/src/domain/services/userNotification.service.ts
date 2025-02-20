import { Injectable } from '@nestjs/common';

import { ErrorResult } from '@app/common/utils';
import { LeanedDocument } from '@app/core-app/providers/base.mongo.repository';
import { UserNotification } from '../../infrastructure/models/userNotification';
import { UserNotificationRepository } from '../../infrastructure/repositories/userNotification.repository';

@Injectable()
export class UserNotificationService {
  constructor(
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  async getAllByUserPaginated(userId: string, limit: number, skip: number) {
    const notifications = await this.userNotificationRepository.get(
      { userId, active: true, deleted: false },
      limit,
      skip,
      { createdAt: -1 },
    );

    return notifications;
  }

  async getAllByUser(userId: string) {
    const notifications = await this.userNotificationRepository.getAll(
      { userId, active: true, deleted: false },
      { createdAt: -1 },
    );

    return notifications;
  }

  async delete(id: string, userId?: string) {
    let notification: LeanedDocument<UserNotification> | null;

    if (userId) {
      notification = await this.userNotificationRepository.getActiveByIdAndUser(
        id,
        userId,
      );
    } else {
      notification = await this.userNotificationRepository.getActiveById(id);
    }

    if (!notification) {
      throw new ErrorResult({
        code: 404_003,
        clean_message: 'La notification est introuvable',
        message: `La notification [${id}] est introuvable`,
      });
    }

    notification.active = false;
    notification.deleted = true;
    notification.deletedAt = new Date();

    return this.userNotificationRepository.update(notification);
  }

  async getById(id: string) {
    const notification = await this.userNotificationRepository.getById(id);

    if (!notification) {
      throw new ErrorResult({
        code: 404_003,
        clean_message: 'La notification est introuvable',
        message: `La notification [${id}] est introuvable`,
      });
    }

    return notification;
  }
}
