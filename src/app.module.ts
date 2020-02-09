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
import { FileService } from './file/file.service'
import { FileController } from './file/file.controller'
import { FileModule } from './file/file.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      installSubscriptionHandlers: true,
    }),
    // MailerModule.forRoot({
    //   transport: 'smtp.mailtrap.io',

    //   template: {
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    UserModule,
    GroupModule,
    AuthenticationModule,
    TaskModule,
    EventModule,
    MailModule,
    MessageModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
