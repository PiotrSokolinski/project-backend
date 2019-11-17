import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { TaskEntity } from './task.entity'
import { TaskDto } from './dto/task.dto'
import { TaskService } from './task.service'
import { inputTask } from './inputs/task.input'
import { inputUpdateTask } from './inputs/update-task.input'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'
import { ReturnUserDto } from '../user/dto/return-user.dto'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'

@Resolver(of => TaskEntity)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Query(() => TaskDto)
  @UseGuards(GqlAuthGuard)
  async getCurrentTask(@CurrentUser() user: ReturnUserDto) {
    return this.taskService.getCurrentTask(user.id)
  }

  //   @Query(() => TaskDto)
  //   @UseGuards(GqlAuthGuard)
  //   async getGroupTasks(@Args('id') id: number) {
  //     return this.taskService.getCurrentTask(user.id)
  //   }

  @Mutation(() => TaskDto)
  @UseGuards(GqlAuthGuard)
  async createTask(@CurrentUser() user: ReturnUserDto, @Args('data') data: inputTask) {
    const assignee = await this.userService.findById(data.assignee)
    const creator = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findOneById(data.group)
    if (!assignee) {
      throw new Error('Assignee does not exist')
    }
    return this.taskService.createTask(data, creator, assignee, group)
  }

  @Mutation(() => TaskDto)
  @UseGuards(GqlAuthGuard)
  async updateTask(@Args('data') data: inputUpdateTask) {
    const assignee = await this.userService.findById(data.assignee)
    const updatedTask = await this.userService.findById(data.id)
    if (!assignee) {
      throw new Error('Assignee does not exist')
    }
    return this.taskService.updateTask(data, updatedTask, assignee)
  }
}
