import { Module } from '@nestjs/common';
import { ProfService } from './prof.service';

@Module({
  providers: [ProfService],
  exports: [ProfService],
})
export class ProfModule {}
