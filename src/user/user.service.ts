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

  async updateUser(user: UserEntity): Promise<UserEntity> {
    return await this.UserRepository.save(user)
  }

  // async findGroupUsers(passedId: number) {
  //   return await this.UserRepository.find({ where: { group: { id: passedId } } })
  // }
}
