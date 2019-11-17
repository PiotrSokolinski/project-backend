import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Inject, forwardRef, UseGuards } from '@nestjs/common'
import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { ReturnUserDto } from './dto/return-user.dto'
import { UserService } from './user.service'
import { AuthenticationService } from '../authentication/authentication.service'
import { MailService } from '../mail/mail.service'
import { inputUser } from './input/user.input'
import { RequestResetPasswordDto } from '../mail/dto/requestResetPassword.dto'
import { GqlAuthGuard } from '../guards/GqlAuthenticationGuard'
import { CurrentUser } from '../decorators/user.decorator'

@Resolver(of => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
    private readonly mailService: MailService,
  ) {}

  @Query(returns => [ReturnUserDto])
  async getUsers() {
    return this.userService.getUsers()
  }

  @Query(returns => ReturnUserDto)
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: ReturnUserDto) {
    return this.userService.findByEmail(user.email)
  }

  @Mutation(returns => CreateUserDto)
  async register(@Args('data') data: inputUser) {
    const user = await this.userService.findByEmail(data.email)
    if (user) {
      throw new Error('User already exists!')
    }
    return this.authenticationService.registerUser(data)
    // const token = await this.authenticationService.generateToken(data)
    // return this.userService.createUser(data, token)
  }

  @Mutation(returns => ReturnUserDto)
  async login(@Args('email') email: string, @Args('password') password: string) {
    //   const user = await this.userService.findByEmail(email)
    //   if (!user) {
    //     throw new Error('Wrong email or password!')
    //   }
    // return this.authenticationService.validatePassword(user, password)
    return this.authenticationService.loginUser(email, password)
  }

  @Mutation(returns => ReturnUserDto)
  @UseGuards(GqlAuthGuard)
  async editName(
    @CurrentUser() user: ReturnUserDto,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.editName(foundUser, firstName, lastName)
  }

  @Mutation(returns => ReturnUserDto)
  @UseGuards(GqlAuthGuard)
  async editUserDetails(
    @Args('id') id: number,
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

  @Mutation(returns => ReturnUserDto)
  @UseGuards(GqlAuthGuard)
  async changeEmail(
    @CurrentUser() user: ReturnUserDto,
    @Args('password') password: string,
    @Args('email') email: string,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.changeEmail(foundUser, password, email)
  }

  @Mutation(returns => ReturnUserDto)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @CurrentUser() user: ReturnUserDto,
    @Args('password') password: string,
    @Args('newPassword') newPassword: string,
  ) {
    const foundUser = await this.userService.findByEmail(user.email)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.changePassword(foundUser, password, newPassword)
  }

  @Mutation(returns => ReturnUserDto)
  @UseGuards(GqlAuthGuard)
  async removeUserFromGroup(@Args('id') id: number) {
    const foundUser = await this.userService.findById(id)
    if (!foundUser) {
      throw new Error('Something went wrong')
    }
    return this.userService.removeUserFromGroup(foundUser)
  }

  @Mutation(returns => RequestResetPasswordDto)
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

  @Mutation(returns => RequestResetPasswordDto)
  async setPassword(@Args('newPassword') newPassword: string, @Args('resetPasswordToken') resetPasswordToken: string) {
    const user = await this.userService.findByToken(resetPasswordToken)
    if (!user) {
      throw new Error('Password reset token is invalid or has expired.')
    }
    const updatedUser = await this.userService.setNewPassword(user, newPassword)
    if (!updatedUser) {
      throw new Error('Password was not set.')
    }
    return { success: false }
  }
}
