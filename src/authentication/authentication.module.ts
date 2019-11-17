import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthenticationService } from './authentication.service'
import { JwtStrategy } from './jwt.strategy'
import { UserModule } from '../user/user.module'
import { jwtConstants } from './constants'

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    forwardRef(() => UserModule),
    PassportModule,
  ],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
