import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql'
import { UseGuards, Inject } from '@nestjs/common'
import { ID, Int } from 'type-graphql'
import { PubSubEngine } from 'graphql-subscriptions'

import { Message } from './message.entity'
import { MessageService } from './message.service'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'
import { UserService } from '../user/user.service'
import { GroupService } from '../group/group.service'
import { User } from '../user/user.entity'

const NEW_MESSAGE_CREATED = 'newMessageCreated'

@Resolver(of => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    @Inject('PUB_SUB') private readonly pubSub: PubSubEngine,
  ) {}

  @Mutation(returns => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @CurrentUser() user: User,
    @Args('text') text: string,
    @Args({ name: 'id', type: () => ID }) id: number,
  ) {
    const creator = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findOneById(id)
    if (!creator || !group) {
      throw new Error('Something went wrong')
    }
    const message = await this.messageService.createMessage(text, creator, group)
    this.pubSub.publish(NEW_MESSAGE_CREATED, { [NEW_MESSAGE_CREATED]: message })
    return message
  }

  @Subscription(returns => Message)
  async newMessageCreated() {
    return this.pubSub.asyncIterator(NEW_MESSAGE_CREATED)
  }

  @Query(returns => [Message])
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args({ name: 'skip', type: () => Int }) skip: number,
    @Args({ name: 'take', type: () => Int }) take: number,
  ) {
    return this.messageService.getAllMessages(id, skip, take)
  }
}
