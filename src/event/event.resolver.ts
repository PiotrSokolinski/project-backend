import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { ID } from 'type-graphql'
import { UseGuards } from '@nestjs/common'
import { Event } from './event.entity'
import { EventService } from './event.service'
import { inputEvent } from './inputs/event.input'
import { inputUpdateEvent } from './inputs/update-event.input'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'
import { User } from '../user/user.entity'

@Resolver(of => Event)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  async createEvent(@CurrentUser() user: User, @Args('data') data: inputEvent) {
    const invitedMembers = await this.userService.findAllByIds(data.invited)
    const creator = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findOneById(data.group)
    if (!invitedMembers || !creator || !group) {
      throw new Error('Something went wrong')
    }
    return this.eventService.createEvent(data, creator, invitedMembers, group)
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  async updateEvent(@CurrentUser() user: User, @Args('data') data: inputUpdateEvent) {
    const invitedMembers = await this.userService.findAllByIds(data.invited)
    const updatedEvent = await this.eventService.findById(data.id)
    if (!invitedMembers || !updatedEvent) {
      throw new Error('Something went wrong')
    }
    return this.eventService.updateEvent(data, updatedEvent, invitedMembers)
  }

  @Query(() => [Event])
  @UseGuards(GqlAuthGuard)
  async getEvents(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args('dateFrom') dateFrom: string,
    @Args('dateTo') dateTo: string,
  ) {
    return this.eventService.getEvents(id, dateFrom, dateTo)
  }

  @Query(() => Event)
  @UseGuards(GqlAuthGuard)
  async getEvent(
    @CurrentUser() user: User,
    @Args('current') current: boolean,
    @Args({ name: 'id', type: () => ID }) id?: number,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (current) return this.eventService.getCurrentEvent(foundUser.id)
    return this.eventService.getOneEvent(id)
  }

  @ResolveProperty(returns => User)
  async author(@Parent() getEvent) {
    const { id } = getEvent
    return await this.eventService.findEventAuthor(id)
  }

  @ResolveProperty(returns => User)
  async invitedMembers(@Parent() getEvent) {
    const { id } = getEvent
    return await this.eventService.findInvitedMembers(id)
  }

  @Mutation(returns => Event)
  @UseGuards(GqlAuthGuard)
  async deleteEvent(@Args({ name: 'id', type: () => ID }) id: number) {
    const deletedEvent = await this.eventService.findById(id)
    if (!deletedEvent) {
      throw new Error('Something went wrong')
    }
    return this.eventService.deleteEvent(deletedEvent)
  }
}
