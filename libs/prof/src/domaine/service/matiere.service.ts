/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorResult } from '@app/common/utils';
import { Matiere } from '@app/prof/infrastructure/models/matiere.model';
import { MatiereRepository } from '@app/prof/infrastructure/repository/matiere.repo';
import { UserRepository } from '@app/prof/infrastructure/repository/user.repository';
import { Injectable } from '@nestjs/common';

// TODO: Service a tester
@Injectable()
export class MatiereService {
  constructor(
    private readonly matiereRepository: MatiereRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createMatiere(input: Partial<Matiere>) {
    const prof = input.prof;
    const ExistProf = await this.userRepository.getOne({ name: name });

    if (ExistProf === null) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Professeur introuvable',
        message: `Professeur introuvable`,
      });
    }

    const profId = ExistProf._id as unknown as string;

    const matiereDto: Partial<Matiere> = {};
    matiereDto.name = input.name;
    matiereDto.code = input.code;
    matiereDto.prof = profId;

    const matiere = await this.matiereRepository.create(matiereDto);

    return matiere;
  }

  async listMatiere(payload: any) {
    const { filter, sort } = payload;
    const filiere = await this.matiereRepository.getAll(filter, sort);

    return filiere;
  }

  async getMatiereById(Id: string) {
    const filiere = await this.matiereRepository.getById(Id);

    if (filiere === null) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Cette matiere est introuvable',
        message: `Cette matiere est introuvable`,
      });
    }

    return filiere;
  }

  async updateMatiere(Id: string, payload: any) {
    const { name, code, prof } = payload;
    const ExistMatiere = await this.matiereRepository.getOne({ name: name });

    if (ExistMatiere === null) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Cette filière est introuvable',
        message: `Cette filière est introuvable`,
      });
    }

    const profExist = await this.userRepository.getOne({ name: prof });

    if (profExist === null) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Professeur inexistant',
        message: `Professeur inexistant`,
      });
    }

    const profId = profExist._id as unknown as string;

    const matiereId = ExistMatiere._id as unknown as string;

    const updatedMatiere = await this.matiereRepository.updateById(matiereId, {
      name: name,
      code: code,
      prof: prof,
    });

    return updatedMatiere;
  }

  async deleteFiliere(Id: string) {
    const existMatiere = await this.matiereRepository.exists({ _id: Id });

    if (!existMatiere) {
      throw new ErrorResult({
        code: 404_010,
        clean_message: 'Cette matiere est introuvable',
        message: `Cette matiere est introuvable`,
      });
    }

    const deletedMatiere = await this.matiereRepository.deleteById(Id);

    return deletedMatiere;
  }
}
