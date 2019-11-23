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

  async findById(passedId: number): Promise<TaskEntity> {
    return await this.TaskRepository.findOne({ where: { id: passedId } })
  }

  // TO DO: why does not work with @CurrentUser id
  // in other places Current User works fine
  async getCurrentTask(userId: number): Promise<TaskEntity> {
    const tasks = await this.TaskRepository.find({
      where: {
        author: { id: userId },
      },
      order: {
        createdAt: 'ASC',
      },
    })
    return tasks[tasks.length - 1]
  }

  async getGroupTasks(passedId: number): Promise<TaskEntity[]> {
    return await this.TaskRepository.find({ where: { group: { id: passedId } } })
  }

  async getGroupTasksToDoInProgress(passedId: number): Promise<TaskEntity[]> {
    const toDoTasks = await this.TaskRepository.find({ where: { group: { id: passedId }, status: 'To Do' } })
    const inProgressTasks = await this.TaskRepository.find({
      where: { group: { id: passedId }, status: 'In Progress' },
    })
    return toDoTasks.concat(inProgressTasks)
  }
}
