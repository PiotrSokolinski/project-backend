import { GroupResolver } from './group.resolver'
import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GroupEntity } from './group.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity]), UserModule],
  providers: [GroupResolver, GroupService],
  exports: [GroupService],
})
export class GroupModule {}
