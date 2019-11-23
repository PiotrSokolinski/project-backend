import { EventResolver } from './event.resolver'
import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from './event.entity'
import { UserModule } from '../user/user.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), UserModule, GroupModule],
  providers: [EventResolver, EventService],
})
export class EventModule {}
