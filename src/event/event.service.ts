import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Event } from './event.entity'
import { Repository, getConnection } from 'typeorm'
import { User } from '../user/user.entity'

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly EventRepository: Repository<Event>) {}

  async createEvent(data: any, creator: any, invitedMembers: any, group: any): Promise<Event> {
    let event = new Event()
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

  async updateEvent(data: any, event: any, invitedMembers: any): Promise<Event> {
    event.name = data.name
    event.description = data.description
    event.startDate = data.startDate
    event.endDate = data.endDate
    event.invitedMembers = invitedMembers

    return await this.EventRepository.save(event)
  }

  async findById(passedId: number): Promise<Event> {
    return await this.EventRepository.findOne(passedId)
  }

  async getEvents(passedId: number, dateFrom: string, dateTo: string): Promise<Event[]> {
    const events = await this.EventRepository.find({ where: { group: { id: passedId } } })
    return events.filter(
      event =>
        new Date(event.startDate).getTime() > new Date(dateFrom).getTime() &&
        new Date(event.endDate).getTime() < new Date(dateTo).getTime(),
    )
  }

  async getCurrentEvent(userId: number): Promise<Event> {
    const events = await this.EventRepository.find()
    const filteredEvents = events.filter(event =>
      event.invitedMembers.some(invitedMember => invitedMember.id === userId),
    )
    let eventIdInTable = 0
    let smallestDifference = Infinity
    for (let i = 0; i < filteredEvents.length; i += 1) {
      const eventTime = new Date(events[i].startDate).getTime()
      const currentTime = new Date().getTime()
      const difference = eventTime - currentTime
      if (eventTime > currentTime && difference < smallestDifference) {
        smallestDifference = difference
        eventIdInTable = i
      }
    }
    return filteredEvents[eventIdInTable]
  }

  async getOneEvent(passedId: number): Promise<Event> {
    return await this.EventRepository.findOne({ where: { id: passedId } })
  }

  async findEventAuthor(eventId: number): Promise<User> {
    const event = await this.EventRepository.findOne({ where: { id: eventId } })
    return event.author
  }

  async findInvitedMembers(eventId: number): Promise<User[]> {
    const event = await this.EventRepository.findOne({ where: { id: eventId } })
    return event.invitedMembers
  }

  async deleteEvent(event: Event): Promise<Event> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Event)
      .where('id = :id', { id: event.id })
      .execute()
    return event
  }
}
