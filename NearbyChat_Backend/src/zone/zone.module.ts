import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './zone.entity';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Zone])],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService], // Exporté pour être utilisé par le MessageModule ou ChatGateway
})
export class ZoneModule {}
