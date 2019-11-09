import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { UserEntity } from '../user/user.entity'

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn() id: number

  @Column('varchar', { length: 50 })
  name: string

  @OneToMany(type => UserEntity, member => member.group)
  members: UserEntity[]

  @Column('varchar')
  avatarUrl: string

  @Column('varchar')
  address: string

  @Column('numeric')
  number: number

  @Column('numeric')
  zipCode: number

  @Column('varchar')
  city: string

  @Column('varchar')
  country: string
}
