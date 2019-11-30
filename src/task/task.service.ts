import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { Repository, getConnection } from 'typeorm'
import { User } from '../user/user.entity'

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private readonly TaskRepository: Repository<Task>) {}

  async createTask(data: any, creator: any, assignee: any, group: any): Promise<Task> {
    let task = new Task()
    task.name = data.name
    task.description = data.description
    task.status = data.status
    task.priority = data.priority
    task.status = 'To Do'
    task.author = creator
    task.assignee = assignee
    task.group = group
    await this.TaskRepository.save(task)

    return task
  }

  async updateTask(data: any, task: any, assignee: any): Promise<Task> {
    task.name = data.name
    task.description = data.description
    task.status = data.status
    task.priority = data.priority
    task.assignee = assignee

    return await this.TaskRepository.save(task)
  }

  async findById(passedId: number): Promise<Task> {
    return await this.TaskRepository.findOne({ where: { id: passedId } })
  }

  // TO DO: why does not work with @CurrentUser id
  // in other places Current User works fine
  async getCurrentTask(userId: number): Promise<Task> {
    const tasks = await this.TaskRepository.find({
      where: {
        assignee: { id: userId },
      },
      order: {
        createdAt: 'ASC',
      },
    })
    return tasks[tasks.length - 1]
  }

  async getGroupTasks(passedId: number): Promise<Task[]> {
    return await this.TaskRepository.find({
      where: { group: { id: passedId } },
      order: {
        createdAt: 'DESC',
      },
    })
  }

  async getGroupTasksToDoInProgress(passedId: number): Promise<Task[]> {
    const toDoTasks = await this.TaskRepository.find({ where: { group: { id: passedId }, status: 'To Do' } })
    const inProgressTasks = await this.TaskRepository.find({
      where: { group: { id: passedId }, status: 'In Progress' },
    })
    return toDoTasks.concat(inProgressTasks)
  }

  async getOneTask(passedId: number): Promise<Task> {
    return await this.TaskRepository.findOne({ where: { id: passedId } })
  }

  async changeTaskStatus(task: Task, status: string): Promise<Task> {
    task.status = status
    return await this.TaskRepository.save(task)
  }

  async deleteTask(task: Task): Promise<Task> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :id', { id: task.id })
      .execute()
    return task
  }
}
