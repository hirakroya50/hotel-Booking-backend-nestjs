import { Module } from '@nestjs/common';
import { ClodinaryController } from './clodinary.controller';
import { ClodinaryService } from './clodinary.service';
@Module({
  controllers: [ClodinaryController],
  providers: [ClodinaryService],
})
export class ClodinaryModule {}
