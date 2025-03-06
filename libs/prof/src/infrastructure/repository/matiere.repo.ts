import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Matiere } from '../models/matiere.model';

@Injectable()
export class MatiereRepository extends BaseRepository<Matiere> {
  constructor(
    @InjectModel(Matiere.name, MAIN_DATABASE_CONNECTION_NAME)
    model: Model<Matiere>,
  ) {
    super(model);
  }
}
