import { Injectable, Inject, forwardRef } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { UserEntity } from '../user/user.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async registerUser(user: any): Promise<any> {
    const token = await this.generateToken(user)
    return await this.userService.createUser(user, token)
  }

  async generateToken(user: any): Promise<any> {
    const payload = { username: user.email }
    return this.jwtService.sign(payload)
  }

  // async validatePassword(user: any, password: string): Promise<any> {
  //   if (await bcrypt.compare(password, user.hashedPassword)) {
  //     const newToken = await this.generateToken(user)
  //     user.token = newToken
  //     this.userService.updateToken(user.id, newToken)
  //     const { hashedPassword, ...result } = user
  //     return result
  //   }
  //   throw new Error('Wrong email or password!')
  // }

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new Error('Wrong email or password!')
    }
    user.token = await this.generateToken(user)
    return await this.userService.updateUser(user)
  }
}
