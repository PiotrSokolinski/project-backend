import { Module } from '@nestjs/common'
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { UserModule } from './user/user.module'
import { GroupModule } from './group/group.module'
import { TaskModule } from './task/task.module'
import { EventModule } from './event/event.module'
import { AuthenticationModule } from './authentication/authentication.module'
import { MailModule } from './mail/mail.module'
import { MessageModule } from './message/message.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      installSubscriptionHandlers: true,
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    GroupModule,
    AuthenticationModule,
    TaskModule,
    EventModule,
    MailModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
