import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Group } from './group.entity'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'

@Injectable()
export class GroupService {
  constructor(@InjectRepository(Group) private readonly GroupRepository: Repository<Group>) {}

  async createGroup(user: User, data: any): Promise<Group> {
    let group = new Group()
    group.name = data.name
    group.address = data.address ? data.address : null
    group.number = data.number ? data.number : null
    group.zipCode = data.zipCode ? data.zipCode : null
    group.city = data.city ? data.city : null
    group.country = data.country ? data.country : null
    group.members = [user]
    user.owner = true
    await this.GroupRepository.save(group)
    return group
  }

  async updateGroup(data: any, group: Group): Promise<Group> {
    group.name = data.name
    group.address = data.address
    group.number = data.number
    group.zipCode = data.zipCode
    group.city = data.city
    group.country = data.country
    return this.GroupRepository.save(group)
  }

  async updateGroupProperty(group: Group): Promise<Group> {
    return this.GroupRepository.save(group)
  }

  async findOneById(passedId: number): Promise<Group> {
    return this.GroupRepository.findOne({ where: { id: passedId } })
  }

  async findGroupForUser(passedId: number): Promise<Group> {
    const groups = await this.GroupRepository.find()
    const group = groups.find(group => group.members.some(member => member.id === passedId))
    return group
  }
}
