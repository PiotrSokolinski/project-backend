import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import { Group } from '../group/group.entity'

@Injectable()
export class MessageService {
  constructor(@InjectRepository(Message) private readonly MessageRepository: Repository<Message>) {}

  async createMessage(text: string, creator: User, group: Group): Promise<Message> {
    let message = new Message()
    message.text = text
    message.sender = creator
    message.group = group
    await this.MessageRepository.save(message)

    return message
  }

  async getAllMessages(passedId: number, skip: number, take: number): Promise<Message[]> {
    return await this.MessageRepository.find({
      where: { group: { id: passedId } },
      order: { id: 'DESC' },
      skip: skip,
      take: take,
    })
  }
}
