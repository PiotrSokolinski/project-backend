import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { Inject, forwardRef, UseGuards } from '@nestjs/common'
import { ID } from 'type-graphql'
import { Group } from './group.entity'
import { GroupService } from './group.service'
import { UserService } from '../user/user.service'
import { inputGroup } from './input/group.input'
import { inputUpdateGroup } from './input/update-group.dto'
import { CurrentUser } from '../decorators/user.decorator'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { User } from '../user/user.entity'

@Resolver(of => Group)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Mutation(returns => Group)
  @UseGuards(GqlAuthGuard)
  async createGroup(@CurrentUser() user: User, @Args('data') data: inputGroup) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser || foundUser.group) {
      throw new Error('You can not create group')
    }
    return this.groupService.createGroup(foundUser, data)
  }

  @Mutation(returns => Group)
  @UseGuards(GqlAuthGuard)
  async updateGroup(@Args('data') data: inputUpdateGroup) {
    const updatedGroup = await this.groupService.findOneById(data.id)
    if (!updatedGroup) {
      throw new Error('You can not create group')
    }
    return this.groupService.updateGroup(data, updatedGroup)
  }

  @Query(returns => Group, { name: 'group' })
  @UseGuards(GqlAuthGuard)
  async getGroup(@Args({ name: 'id', type: () => ID }) id: number) {
    return await this.groupService.findOneById(id)
  }

  @ResolveProperty(() => [User])
  async members(@Parent() group) {
    const { id } = group
    return await this.userService.findGroupUsers(id)
  }
}
