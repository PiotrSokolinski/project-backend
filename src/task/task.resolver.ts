import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ID } from 'type-graphql'

import { Task } from './task.entity'
import { TaskService } from './task.service'
import { inputTask } from './inputs/task.input'
import { inputUpdateTask } from './inputs/update-task.input'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'
import { User } from '../user/user.entity'

@Resolver(of => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Query(returns => Task)
  @UseGuards(GqlAuthGuard)
  async getTask(
    @CurrentUser() user: User,
    @Args('current') current: boolean,
    @Args({ name: 'id', type: () => ID }) id?: number,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (current) return this.taskService.getCurrentTask(foundUser.id)
    return this.taskService.getOneTask(id)
  }

  @ResolveProperty(returns => User)
  async author(@Parent() getTask) {
    const { id } = getTask
    return await this.userService.findTaskAuthor(id)
  }

  @ResolveProperty(returns => User)
  async assignee(@Parent() getTask) {
    const { id } = getTask
    return await this.userService.findAssignee(id)
  }

  @Query(returns => [Task])
  @UseGuards(GqlAuthGuard)
  async getGroupTasks(@Args({ name: 'id', type: () => ID }) id: number) {
    return this.taskService.getGroupTasks(id)
  }

  @Query(returns => [Task])
  @UseGuards(GqlAuthGuard)
  async getGroupTasksToDoInProgress(@Args({ name: 'id', type: () => ID }) id: number) {
    return this.taskService.getGroupTasksToDoInProgress(id)
  }

  @Mutation(returns => Task)
  @UseGuards(GqlAuthGuard)
  async createTask(@CurrentUser() user: User, @Args('data') data: inputTask) {
    const assignee = await this.userService.findById(data.assignee)
    const creator = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findOneById(data.group)
    if (!assignee || !creator || !group) {
      throw new Error('Something went wrong')
    }
    return this.taskService.createTask(data, creator, assignee, group)
  }

  @Mutation(returns => Task)
  @UseGuards(GqlAuthGuard)
  async updateTask(@Args('data') data: inputUpdateTask) {
    const assignee = await this.userService.findById(data.assignee)
    const updatedTask = await this.taskService.findById(data.id)
    if (!assignee || !updatedTask) {
      throw new Error('Something went wrong')
    }
    return this.taskService.updateTask(data, updatedTask, assignee)
  }

  @Mutation(returns => Task)
  @UseGuards(GqlAuthGuard)
  async changeTaskStatus(@Args({ name: 'id', type: () => ID }) id: number, @Args('status') status: string) {
    const updatedTask = await this.taskService.findById(id)
    if (!updatedTask) {
      throw new Error('Something went wrong')
    }
    return this.taskService.changeTaskStatus(updatedTask, status)
  }

  @Mutation(returns => Task)
  @UseGuards(GqlAuthGuard)
  async deleteTask(@Args({ name: 'id', type: () => ID }) id: number) {
    const deletedTask = await this.taskService.findById(id)
    if (!deletedTask) {
      throw new Error('Something went wrong')
    }
    return this.taskService.deleteTask(deletedTask)
  }
}
