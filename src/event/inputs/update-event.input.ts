import { Field, InputType, ID } from 'type-graphql'

@InputType()
export class inputUpdateEvent {
  @Field(type => ID) readonly id: number
  @Field() readonly name?: string
  @Field() readonly description?: string
  @Field() readonly startDate?: Date
  @Field() readonly endDate?: Date
  @Field(type => ID) readonly invited?: number[]
}
