import { Module } from '@nestjs/common';
import { LibProfDomaineModule } from './domaine/domaine.module';
import { LibProfInfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [LibProfDomaineModule, LibProfInfrastructureModule],
  providers: [LibProfDomaineModule, LibProfInfrastructureModule],
  exports: [LibProfDomaineModule, LibProfInfrastructureModule],
})
export class LibProfModule {}
