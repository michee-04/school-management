import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { BaseRepository } from '@app/core-app/providers/base.mongo.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Departement } from '../models/departement.model';

@Injectable()
export class DepartementRepository extends BaseRepository<Departement> {
  constructor(
    @InjectModel(Departement.name, MAIN_DATABASE_CONNECTION_NAME)
    model: Model<Departement>,
  ) {
    super(model);
  }
}
