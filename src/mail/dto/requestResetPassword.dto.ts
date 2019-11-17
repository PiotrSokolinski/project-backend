import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class RequestResetPasswordDto {
  @Field() readonly success: boolean
}
