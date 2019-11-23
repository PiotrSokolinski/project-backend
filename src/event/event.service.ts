import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EventEntity } from './event.entity'
import { Repository } from 'typeorm'
import { EventDto } from './dto/event.dto'
import { UserEntity } from '../user/user.entity'

@Injectable()
export class EventService {
  constructor(@InjectRepository(EventEntity) private readonly EventRepository: Repository<EventEntity>) {}

  async createEvent(data: any, creator: any, invitedMembers: any, group: any): Promise<EventEntity> {
    let event = new EventEntity()
    event.name = data.name
    event.description = data.description
    event.startDate = data.startDate
    event.endDate = data.endDate
    event.author = creator
    event.group = group
    event.invitedMembers = invitedMembers
    await this.EventRepository.save(event)

    return event
  }

  async updateEvent(data: any, event: any, invitedMembers: any): Promise<EventEntity> {
    event.name = data.name
    event.description = data.description
    event.startDate = data.startDate
    event.endDate = data.endDate
    event.invitedMembers = invitedMembers

    return await this.EventRepository.save(event)
  }

  async findById(passedId: number): Promise<EventEntity> {
    return await this.EventRepository.findOne(passedId)
  }

  async getEvents(passedId: number, dateFrom: string, dateTo: string): Promise<EventEntity[]> {
    const events = await this.EventRepository.find({ where: { group: { id: passedId } } })
    return events.filter(
      event =>
        new Date(event.startDate).getTime() > new Date(dateFrom).getTime() &&
        new Date(event.endDate).getTime() < new Date(dateTo).getTime(),
    )
  }

  // TO DO: do poprawy
  async getCurrentEvent(userId: number): Promise<EventEntity> {
    const events = await this.EventRepository.find({
      where: {
        author: { id: userId },
      },
    })

    let eventIdInTable = 0
    let smallestDifference = Infinity
    const dateToCompare = new Date()
    for (let i = 0; i < events.length - 1; i += 1) {
      const eventTime = new Date(events[i].startDate).getTime()
      const currentTime = dateToCompare.getTime()
      const difference = eventTime - currentTime
      if (eventTime > currentTime && difference < smallestDifference) {
        smallestDifference = difference
        eventIdInTable = i
      }
    }

    return events[eventIdInTable]
  }
}
