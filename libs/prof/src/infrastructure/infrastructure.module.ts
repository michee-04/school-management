import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsMainProviders } from './models';
import { DepartementRepository } from './repository/departement.repo';
import { FiliereRepository } from './repository/filiere.repo';
import { MatiereRepository } from './repository/matiere.repo';
import { OtpRepository } from './repository/otp.repository';
import { SalleRepository } from './repository/salle.repo';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      ModelsMainProviders,
      MAIN_DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [
    UserRepository,
    OtpRepository,
    DepartementRepository,
    FiliereRepository,
    MatiereRepository,
    SalleRepository,
  ],
  exports: [
    UserRepository,
    OtpRepository,
    DepartementRepository,
    FiliereRepository,
    MatiereRepository,
    SalleRepository,
  ],
})
export class LibProfInfrastructureModule {}
