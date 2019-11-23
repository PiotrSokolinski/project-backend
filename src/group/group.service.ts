import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupEntity } from './group.entity'
import { Repository } from 'typeorm'
import { GroupDto } from './dto/group.dto'
import { UserEntity } from '../user/user.entity'

@Injectable()
export class GroupService {
  constructor(@InjectRepository(GroupEntity) private readonly GroupRepository: Repository<GroupEntity>) {}

  async createGroup(user: UserEntity, data: any): Promise<GroupEntity> {
    let group = new GroupEntity()
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

  async updateGroup(data: any, group: GroupEntity): Promise<GroupEntity> {
    group.name = data.name
    group.address = data.address
    group.number = data.number
    group.zipCode = data.zipCode
    group.city = data.city
    group.country = data.country
    return this.GroupRepository.save(group)
  }

  async findOneById(passedId: number): Promise<GroupEntity> {
    return this.GroupRepository.findOne({ where: { id: passedId } })
  }
}
