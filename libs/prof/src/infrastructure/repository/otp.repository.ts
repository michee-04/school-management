import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '../models/otp.model';

@Injectable()
export class OtpRepository extends BaseRepository<Otp> {
  constructor(
    @InjectModel(Otp.name, MAIN_DATABASE_CONNECTION_NAME)
    model: Model<Otp>,
  ) {
    super(model);
  }

  async getLastOneByEmail(email: string) {
    return this.getOne({ email }, { createdAt: -1 });
  }
}
