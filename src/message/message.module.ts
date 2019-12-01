import { MessageResolver } from './message.resolver'
import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { PubSub } from 'graphql-subscriptions'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { UserModule } from '../user/user.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule, GroupModule],
  providers: [
    MessageResolver,
    MessageService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class MessageModule {}
