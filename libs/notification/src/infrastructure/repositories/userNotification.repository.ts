import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { UserNotification } from '../models/userNotification';

@Injectable()
export class UserNotificationRepository extends BaseRepository<UserNotification> {
  constructor(
    @InjectModel(UserNotification.name, MAIN_DATABASE_CONNECTION_NAME)
    readonly model: Model<UserNotification>,
  ) {
    super(model);
  }

  async getActiveById(id: string) {
    return this.getOne({ _id: id, active: true, deleted: false });
  }

  async getActiveByIdAndUser(id: string, userId: string) {
    return this.getOne({ _id: id, userId, active: true, deleted: false });
  }
}
