import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './user.entity'
import { Repository, In } from 'typeorm'
import { inputUser } from './user.input'
import { Group } from '../group/group.entity'

const saltRounds = 10

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly UserRepository: Repository<User>) {}

  async createUser(data: inputUser, token: string, group?: Group): Promise<User> {
    let user = new User()
    user.email = data.email
    user.hashedPassword = await bcrypt.hash(data.password, saltRounds)
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.token = token
    if (group) {
      user.group = group
    }
    await this.UserRepository.save(user)
    return user
  }

  async getUsers(): Promise<User[]> {
    return await this.UserRepository.find()
  }

  async findByEmail(newEmail: string): Promise<User> {
    return await this.UserRepository.findOne({ where: { email: newEmail } })
  }

  async findByToken(newToken: string): Promise<User> {
    return await this.UserRepository.findOne({ where: { token: newToken } })
  }

  async findById(newId: number): Promise<User> {
    return await this.UserRepository.findOne({ where: { id: newId } })
  }

  async updateUser(user: User): Promise<User> {
    return await this.UserRepository.save(user)
  }

  async setNewPassword(user: User, newPassword: string): Promise<User> {
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

  async findAllByIds(ids: number[]): Promise<User[]> {
    return await this.UserRepository.find({
      id: In(ids),
    })
  }

  async findTaskAuthor(taskId: number): Promise<User> {
    const users = await this.UserRepository.find()
    const user = users.find(user => {
      for (let i = 0; i < user.authorizedTasks.length; i += 1) {
        if (user.authorizedTasks[i].id === taskId) return true
      }
    })
    return user
  }

  async findAssignee(taskId: number): Promise<User> {
    const users = await this.UserRepository.find()
    const user = users.find(user => {
      for (let i = 0; i < user.assignedTasks.length; i += 1) {
        if (user.assignedTasks[i].id === taskId) return true
      }
    })
    return user
  }
}
