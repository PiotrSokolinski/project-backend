import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class SuccessDto {
  @Field() readonly success: boolean
}
