import { Resolver, Query, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { Inject, forwardRef, UseGuards } from '@nestjs/common'
import { User } from './user.entity'
import { UserService } from './user.service'
import { AuthenticationService } from '../authentication/authentication.service'
import { MailService } from '../mail/mail.service'
import { inputUser } from './user.input'
import { SuccessDto } from '../mail/success.dto'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'
import { ID } from 'type-graphql'
import { Group } from '../group/group.entity'
import { GroupService } from '../group/group.service'

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
    private readonly mailService: MailService,
    private readonly groupService: GroupService,
  ) {}

  @Query(returns => [User])
  async getUsers() {
    return this.userService.getUsers()
  }

  @Query(returns => User)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.userService.findByEmail(user.email)
  }

  @ResolveProperty(returns => Group)
  async group(@Parent() login) {
    const { id } = login
    return this.groupService.findGroupForUser(id)
  }

  @Mutation(returns => User)
  async register(@Args('data') data: inputUser) {
    const user = await this.userService.findByEmail(data.email)
    if (user) {
      throw new Error('User already exists!')
    }
    return this.authenticationService.registerUser(data)
  }

  @Mutation(returns => User)
  async registerWithInvitation(
    @Args('data') data: inputUser,
    @Args({ name: 'groupId', type: () => ID }) groupId: number,
  ) {
    const user = await this.userService.findByEmail(data.email)
    const group = await this.groupService.findOneById(groupId)
    if (user) {
      throw new Error('User already exists!')
    }
    return this.authenticationService.registerUserWithInvitation(data, group)
  }

  @Mutation(returns => User)
  async login(@Args('email') email: string, @Args('password') password: string) {
    return this.authenticationService.loginUser(email, password)
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async editName(@CurrentUser() user: User, @Args('firstName') firstName: string, @Args('lastName') lastName: string) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.editName(foundUser, firstName, lastName)
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async editUserDetails(
    @Args({ name: 'id', type: () => ID }) id: number,
    @Args('nick') nick: string,
    @Args('role') role: string,
    @Args('color') color: string,
  ) {
    const foundUser = await this.userService.findById(id)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.editUserDetails(foundUser, nick, role, color)
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async changeEmail(@CurrentUser() user: User, @Args('password') password: string, @Args('email') email: string) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.changeEmail(foundUser, password, email)
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.changePassword(foundUser, password, newPassword)
  }

  @Mutation(returns => User)
  @UseGuards(GqlAuthGuard)
  async removeUserFromGroup(@Args({ name: 'id', type: () => ID }) id: number) {
    const foundUser = await this.userService.findById(id)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.removeUserFromGroup(foundUser)
  }

  @Mutation(returns => SuccessDto)
  async requestPasswordReset(@Args('email') email: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    if (user) {
      const token = await this.authenticationService.generateToken(user)
      user.token = token
      await this.userService.updateUser(user)
      await this.mailService.sendResetPasswordEmail(email, token)
    }
    return { success: true }
  }

  @Mutation(returns => SuccessDto)
  async setPassword(@Args('newPassword') newPassword: string, @Args('resetPasswordToken') resetPasswordToken: string) {
    const user = await this.userService.findByToken(resetPasswordToken)
    if (!user) {
      throw new Error('Password reset token is invalid or has expired.')
    }
    const updatedUser = await this.userService.setNewPassword(user, newPassword)
    if (!updatedUser) {
      throw new Error('Password was not set.')
    }
    return { success: true }
  }

  @Mutation(returns => SuccessDto)
  @UseGuards(GqlAuthGuard)
  async sendInvitations(
    @Args({ name: 'invitations', type: () => [String] }) invitations: string[],
    @CurrentUser() user: User,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    const group = await this.groupService.findGroupForUser(foundUser.id)
    console.log(group)
    console.log(foundUser)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    for (let i = 0; i < invitations.length; i += 1) {
      const token = await this.authenticationService.generateInvitationToken(foundUser, group)
      await this.mailService.sendInvitationEmail(invitations[i], token)
    }
    return { success: true }
  }
}
