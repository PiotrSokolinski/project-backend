import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TaskEntity } from './task.entity'
import { Repository } from 'typeorm'
import { TaskDto } from './dto/task.dto'
import { UserEntity } from '../user/user.entity'

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskEntity) private readonly TaskRepository: Repository<TaskEntity>) {}

  async createTask(data: any, creator: any, assignee: any, group: any): Promise<TaskEntity> {
    let task = new TaskEntity()
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

  async updateTask(data: any, task: any, assignee: any): Promise<TaskEntity> {
    task.name = data.name
    task.description = data.description
    task.status = data.status
    task.priority = data.priority
    task.assignee = assignee

    return await this.TaskRepository.save(task)
  }

  async getCurrentTask(userId): Promise<TaskEntity> {
    const tasks = await this.TaskRepository.find({
      where: {
        authorId: userId,
      },
      order: {
        createdAt: 'ASC',
      },
    })
    return tasks[tasks.length - 1]
  }

  //   async getTasks(): Promise<TaskEntity[]> {
  //     return await this.TaskRepository.find()
  //   }
}
