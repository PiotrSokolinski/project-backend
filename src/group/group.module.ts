import { GroupResolver } from './group.resolver'
import { Module, forwardRef } from '@nestjs/common'
import { GroupService } from './group.service'
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Group } from './group.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Group]), forwardRef(() => UserModule)],
  providers: [GroupResolver, GroupService],
  exports: [GroupService],
})
export class GroupModule {}
