import { Field, InputType, ID } from 'type-graphql'

@InputType()
export class inputUpdateTask {
  @Field(type => ID) readonly id?: number
  @Field() readonly name?: string
  @Field() readonly description?: string
  @Field(type => ID) readonly assignee?: number
  @Field() readonly priority?: string
  @Field() readonly status?: string
  // @Field() readonly tags: string[]
}
