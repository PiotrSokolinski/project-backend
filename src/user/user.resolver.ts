import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Inject, forwardRef } from '@nestjs/common'
import { UserEntity } from './user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { ReturnUserDto } from './dto/return-user.dto'
import { UserService } from './user.service'
import { AuthenticationService } from '../authentication/authentication.service'
import { inputUser } from './input/user.input'

@Resolver(of => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Query(returns => [ReturnUserDto])
  async getUsers() {
    return this.userService.getUsers()
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
}
