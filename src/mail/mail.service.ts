import { Injectable } from '@nestjs/common'
import { MailerService } from '@nest-modules/mailer'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    this.mailerService
      .sendMail({
        to: email,
        from: 'support@housier.com',
        subject: 'Reset your passowrd!',
        text: `http://localhost:3000/password-set?token=${token}`,
        html: '<b>Reset password!</b>',
      })
      .then(() => {})
      .catch(() => {})
  }
}
