import { Controller, Get } from '@nestjs/common'

@Controller('email')
export class EmailController {
  /**
   * 注册时候的获取用户邮箱
   */
  @Get('register')
  async register() {
    console.warn('..')
  }
}