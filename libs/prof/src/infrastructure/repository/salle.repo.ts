import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Salle } from '../models/salle.model';

@Injectable()
export class SalleRepository extends BaseRepository<Salle> {
  constructor(
    @InjectModel(Salle.name, MAIN_DATABASE_CONNECTION_NAME)
    model: Model<Salle>,
  ) {
    super(model);
  }
}
