/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorResult } from '@app/common/utils';
import { Filiere } from '@app/prof/infrastructure/models/filiere.model';
import { FiliereRepository } from '@app/prof/infrastructure/repository/filiere.repo';
import { Injectable } from '@nestjs/common';

// TODO: Service a tester
@Injectable()
export class FIliereService {
  constructor(private readonly filiereRepository: FiliereRepository) {}

  async createFiliere(input: Partial<Filiere>) {
    const name = input.name;
    const ExistFiliere = await this.filiereRepository.exists({ name: name });

    if (ExistFiliere) {
      throw new ErrorResult({
        code: 409_010,
        clean_message: 'Cette filière existe déjà',
        message: `Cette filière existe déjà`,
      });
    }
    const filiereDto: Partial<Filiere> = {};
    filiereDto.name = input.name;
    filiereDto.niveau = input.niveau;

    const filiere = await this.filiereRepository.create(filiereDto);
    return filiere;
  }

  async listFIliere(payload: any) {
    const { filter, sort } = payload;
    const filiere = await this.filiereRepository.getAll(filter, sort);

    return filiere;
  }

  async getFIliereById(Id: string) {
    const filiere = await this.filiereRepository.getById(Id);

    if (filiere === null) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Cette filière est introuvable',
        message: `Cette filière est introuvable`,
      });
    }

    return filiere;
  }

  async updatefiliere(Id: string, payload: any) {
    const { name, niveau } = payload;
    const ExistFIliere = await this.filiereRepository.getOne({ name: name });

    if (ExistFIliere === null) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Cette filière est introuvable',
        message: `Cette filière est introuvable`,
      });
    }

    const filiereId = ExistFIliere._id as unknown as string;

    const updatedFiliere = await this.filiereRepository.updateById(filiereId, {
      name: name,
      niveau: niveau,
    });

    return updatedFiliere;
  }

  async deleteFiliere(Id: string) {
    const existFIliere = await this.filiereRepository.exists({ _id: Id });

    if (!existFIliere) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Cette filière est introuvable',
        message: `Cette filière est introuvable`,
      });
    }

    const deletedFIliere = await this.filiereRepository.deleteById(Id);

    return deletedFIliere;
  }
}
