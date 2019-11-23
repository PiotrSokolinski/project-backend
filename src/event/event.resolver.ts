import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { EventEntity } from './event.entity'
import { EventDto } from './dto/event.dto'
import { EventService } from './event.service'
import { inputEvent } from './inputs/event.input'
import { inputUpdateEvent } from './inputs/update-event.input'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'
import { ReturnUserDto } from '../user/dto/return-user.dto'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'
import { ID } from 'type-graphql'

@Resolver(of => EventEntity)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}

  @Mutation(() => EventDto)
  @UseGuards(GqlAuthGuard)
  async createEvent(@CurrentUser() user: ReturnUserDto, @Args('data') data: inputEvent) {
    const invitedMembers = await this.userService.findAllByIds(data.invited)
    const creator = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findOneById(data.group)
    if (!invitedMembers || !creator || !group) {
      throw new Error('Something went wrong')
    }
    return this.eventService.createEvent(data, creator, invitedMembers, group)
  }

  @Mutation(() => EventDto)
  @UseGuards(GqlAuthGuard)
  async updateEvent(@CurrentUser() user: ReturnUserDto, @Args('data') data: inputUpdateEvent) {
    const invitedMembers = await this.userService.findAllByIds(data.invited)
    const updatedEvent = await this.eventService.findById(data.id)
    if (!invitedMembers || !updatedEvent) {
      throw new Error('Something went wrong')
    }
    return this.eventService.updateEvent(data, updatedEvent, invitedMembers)
  }

  @Query(() => [EventDto])
  @UseGuards(GqlAuthGuard)
  async getEvents(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args('dateFrom') dateFrom: string,
    @Args('dateTo') dateTo: string,
  ) {
    return this.eventService.getEvents(id, dateFrom, dateTo)
  }

  @Query(() => EventDto)
  @UseGuards(GqlAuthGuard)
  async getCurrentEvent(@CurrentUser() user: ReturnUserDto) {
    const foundUser = await this.userService.findByEmail(user.email)
    return this.eventService.getCurrentEvent(foundUser.id)
  }
}
