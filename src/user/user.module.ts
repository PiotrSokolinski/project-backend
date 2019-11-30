import { UserResolver } from './user.resolver'
import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { AuthenticationModule } from '../authentication/authentication.module'
import { MailModule } from '../mail/mail.module'
import { GroupModule } from '../group/group.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthenticationModule, MailModule, forwardRef(() => GroupModule)],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
