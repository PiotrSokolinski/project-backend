import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GroupEntity } from './group.entity'
import { Repository } from 'typeorm'
import { GroupDto } from './dto/group.dto'

@Injectable()
export class GroupService {
  constructor(@InjectRepository(GroupEntity) private readonly GroupRepository: Repository<GroupEntity>) {}

  async createGroup(creatorId: number, data: GroupDto): Promise<GroupEntity> {
    let group = new GroupEntity()
    group.id = 10

    //await this.GroupRepository.save(group)
    return group
  }

  async findOneById(id: number): Promise<GroupEntity> {
    return this.GroupRepository.findOne(id)
  }
}
