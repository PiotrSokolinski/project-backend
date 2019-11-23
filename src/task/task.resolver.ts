import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'
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
import { ID } from 'type-graphql'

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
    const foundUser = await this.userService.findByEmail(user.email)

    return this.taskService.getCurrentTask(foundUser.id)
  }

  @Query(returns => [TaskDto], { name: 'getGroupTasks' })
  @UseGuards(GqlAuthGuard)
  async getGroupTasks(@Args({ name: 'id', type: () => ID }) id: number) {
    return this.taskService.getGroupTasks(id)
  }

  // @Query(() => [ReturnUserDto])
  // @UseGuards(GqlAuthGuard)
  // async author(
  //   @Args({ name: 'groupId', type: () => ID }) groupId: number,
  //   @Args({ name: 'taskId', type: () => ID }) taskId: number,
  // ) {
  //   const group = await this.groupService.findOneById(groupId)
  //   const task = await this.taskService.findById(taskId)

  // }

  // @ResolveProperty('author')
  // @UseGuards(GqlAuthGuard)
  // async author(@Parent() gtGroupTasks) {
  //const { id } = getGroupTasks
  //return await this.userService.getAuthor(id)
  // }

  @Query(() => [TaskDto])
  @UseGuards(GqlAuthGuard)
  async getGroupTasksToDoInProgress(@Args({ name: 'id', type: () => ID }) id: number) {
    return this.taskService.getGroupTasksToDoInProgress(id)
  }

  @Mutation(() => TaskDto)
  @UseGuards(GqlAuthGuard)
  async createTask(@CurrentUser() user: ReturnUserDto, @Args('data') data: inputTask) {
    const assignee = await this.userService.findById(data.assignee)
    const creator = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findOneById(data.group)
    if (!assignee || !creator || !group) {
      throw new Error('Something went wrong')
    }
    return this.taskService.createTask(data, creator, assignee, group)
  }

  @Mutation(() => TaskDto)
  @UseGuards(GqlAuthGuard)
  async updateTask(@Args('data') data: inputUpdateTask) {
    const assignee = await this.userService.findById(data.assignee)
    const updatedTask = await this.taskService.findById(data.id)
    if (!assignee || !updatedTask) {
      throw new Error('Something went wrong')
    }
    return this.taskService.updateTask(data, updatedTask, assignee)
  }
}
