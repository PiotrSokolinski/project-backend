import { EventResolver } from './event.resolver'
import { Module, forwardRef } from '@nestjs/common'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './event.entity'
import { UserModule } from '../user/user.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UserModule, GroupModule],
  providers: [EventResolver, EventService],
})
export class EventModule {}
