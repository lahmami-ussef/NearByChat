import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ZoneModule } from '../zone/zone.module';
import { MessageModule } from '../message/message.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ZoneModule, MessageModule, AuthModule],
  providers: [ChatGateway],
})
export class ChatModule {}
