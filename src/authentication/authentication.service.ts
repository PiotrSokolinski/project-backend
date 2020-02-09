import { Injectable, Inject, forwardRef } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { Group } from '../group/group.entity'

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

  async registerUserWithInvitation(user: any, group: Group): Promise<any> {
    const token = await this.generateToken(user)
    return await this.userService.createUser(user, token, group)
  }

  async generateToken(user: User): Promise<any> {
    const payload = { email: user.email }
    return this.jwtService.sign(payload)
  }

  async generateInvitationToken(user: User, group: Group): Promise<any> {
    const payload = {
      userName: `${user.firstName} ${user.lastName}`,
      groupId: group.id,
      groupName: group.name,
    }
    return this.jwtService.sign(payload)
  }

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new Error('Wrong email or password!')
    }
    user.token = await this.generateToken(user)
    return await this.userService.updateUser(user)
  }
}
