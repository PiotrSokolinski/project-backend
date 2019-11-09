import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { Inject, forwardRef } from '@nestjs/common'
import { ID } from 'type-graphql'
import { GroupEntity } from './group.entity'
import { GroupDto } from './dto/group.dto'
import { GroupService } from './group.service'
import { UserService } from '../user/user.service'
import { inputGroup } from './input/group.input'

@Resolver(of => GroupEntity)
export class GroupResolver {
  constructor(
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Mutation(returns => GroupDto)
  async createGroup(@Args({ name: 'creatorId', type: () => ID }) creatorId: number, @Args('data') data: inputGroup) {
    return this.groupService.createGroup(creatorId, data)
  }

  @Query(returns => GroupDto, { name: 'group' })
  async getGroup(@Args({ name: 'id', type: () => ID }) id: number) {
    return await this.groupService.findOneById(id)
  }

  // @ResolveProperty('users')
  // async getUsers(@Parent() group) {
  //   const { id } = group
  //   return await this.userService.findGroupUsers(id)
  // }
}
