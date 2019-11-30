import { TaskResolver } from './task.resolver'
import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { UserModule } from '../user/user.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule, GroupModule],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
