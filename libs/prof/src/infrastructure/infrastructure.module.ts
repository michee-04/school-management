import { MAIN_DATABASE_CONNECTION_NAME } from '@app/common/constants';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsMainProviders } from './models';
import { OtpRepository } from './repository/otp.repository';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      ModelsMainProviders,
      MAIN_DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [UserRepository, OtpRepository],
  exports: [UserRepository, OtpRepository],
})
export class LibProfInfrastructureModule {}
