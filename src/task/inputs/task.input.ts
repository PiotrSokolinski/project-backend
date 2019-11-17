import { Field, InputType, ID } from 'type-graphql'

@InputType()
export class inputTask {
  @Field() readonly name: string
  @Field() readonly description: string
  @Field(type => ID) readonly assignee: number
  @Field(type => ID) readonly group: number
  @Field() readonly priority: string
  // @Field() readonly tags: string[]
}
