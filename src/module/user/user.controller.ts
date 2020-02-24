import { Controller, Get, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { ICreateUserDTO } from './user.interface'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    const result = await this.userService.findAll()
    return result
  }

  @Post()
  async createUserVO(@Body() user: ICreateUserDTO) {
    const result = await this.userService.createUserDO(user)
    return result
  }
}