import { Injectable } from '@nestjs/common'
// import { MailerService } from '@nest-modules/mailer'
import * as nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'd91ac8e5bccecd',
    pass: '23e7e41382bc35',
  },
})

@Injectable()
export class MailService {
  // constructor(private readonly mailerService: MailerService) {}

  constructor() {}

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const mail = {
      to: email,
      from: 'support@housier.com',
      subject: 'Reset your passowrd!',
      text: `http://localhost:3000/password-reset?token=${token}`,
      html: '<b>Reset password!</b>',
    }
    transport.sendMail(mail, (err, info) => {
      if (err) {
        console.log('err:', err)
      } else {
        console.log('info:', info)
      }
    })
  }

  async sendInvitationEmail(email: string, token: string): Promise<void> {
    const mail = {
      to: email,
      from: 'support@housier.com',
      subject: 'You were invited to the group!',
      text: `http://localhost:3000/registration?token=${token}`,
      html: '<b>Reset password!</b>',
    }
    transport.sendMail(mail, (err, info) => {
      if (err) {
        console.log('err:', err)
      } else {
        console.log('info:', info)
      }
    })
  }
}
