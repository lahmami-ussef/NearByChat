import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ScheduleModule.forRoot(), // Setup pour le CRON
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService], // Pour la Socket Gateway
})
export class MessageModule {}
