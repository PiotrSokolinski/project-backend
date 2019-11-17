import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { GroupEntity } from '../group/group.entity'

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn() id: number

  @CreateDateColumn() createdAt: Date

  @Column('varchar', { length: 50 })
  name: string

  @Column('varchar')
  description: string

  @Column('varchar')
  status: string

  @ManyToOne(type => UserEntity, assignee => assignee.authorizedTasks, {
    cascade: true,
  })
  @JoinColumn()
  assignee: UserEntity

  @ManyToOne(type => UserEntity, author => author.assignedTasks, {
    cascade: true,
  })
  @JoinColumn()
  author: UserEntity

  @ManyToOne(type => GroupEntity, group => group.tasks)
  group: GroupEntity

  @Column('varchar')
  priority: string
}
