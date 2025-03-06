import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Filiere } from '../models/filiere.model';

@Injectable()
export class FiliereRepository extends BaseRepository<Filiere> {
  constructor(
    @InjectModel(Filiere.name, MAIN_DATABASE_CONNECTION_NAME)
    model: Model<Filiere>,
  ) {
    super(model);
  }
}
