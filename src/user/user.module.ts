import { UserResolver } from './user.resolver'
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { AuthenticationModule } from '../authentication/authentication.module'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthenticationModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
