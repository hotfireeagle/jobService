import { Controller, Post, Body } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailDto } from './email.dto'

@Controller('email')
export class EmailController {

  constructor(private readonly emailService: EmailService) {}

  /**
   * 注册时候的获取用户邮箱
   */
  @Post('register')
  async register(@Body() email: EmailDto) {
    return await this.emailService.registerEmailService(email)
  }

}