import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'

const saltRounds = 10

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly UserRepository: Repository<UserEntity>) {}

  async createUser(data: CreateUserDto, token: string): Promise<UserEntity> {
    let user = new UserEntity()
    user.email = data.email
    user.hashedPassword = await bcrypt.hash(data.password, saltRounds)
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.token = token
    await this.UserRepository.save(user)
    return user
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.UserRepository.find()
  }

  async findByEmail(newEmail: string): Promise<UserEntity> {
    return await this.UserRepository.findOne({ where: { email: newEmail } })
  }

  async findByToken(newToken: string): Promise<UserEntity> {
    return await this.UserRepository.findOne({ where: { token: newToken } })
  }

  async findById(newId: number): Promise<UserEntity> {
    return await this.UserRepository.findOne({ where: { id: newId } })
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return await this.UserRepository.save(user)
  }

  async setNewPassword(user: UserEntity, newPassword: string): Promise<UserEntity> {
    const newHashedPassord = await bcrypt.hash(newPassword, saltRounds)
    user.hashedPassword = newHashedPassord
    return await this.updateUser(user)
  }

  async findGroupUsers(passedId: number) {
    return await this.UserRepository.find({ where: { group: { id: passedId } } })
  }

  async editName(user: any, firstName: string, lastName: string) {
    user.firstName = firstName
    user.lastName = lastName
    return await this.updateUser(user)
  }

  async editUserDetails(user: any, nick: string, role: string, color: string) {
    user.nick = nick
    user.role = role
    user.color = color
    return await this.updateUser(user)
  }

  async changeEmail(user: any, password: string, email: string) {
    if (!(await bcrypt.compare(password, user.hashedPassword))) {
      return new Error('Password is incorrect!')
    }
    user.email = email
    return await this.updateUser(user)
  }

  async changePassword(user: any, password: string, newPassword: string) {
    if (!(await bcrypt.compare(password, user.hashedPassword))) {
      return new Error('Password is incorrect!')
    }
    const newHashedPassord = await bcrypt.hash(newPassword, saltRounds)
    user.hashedPassword = newHashedPassord

    return await this.updateUser(user)
  }

  async removeUserFromGroup(user: any) {
    user.group = null
    return await this.updateUser(user)
  }
}
