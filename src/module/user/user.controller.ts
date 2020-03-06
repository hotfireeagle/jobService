import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto, LoginUserDto } from './user.dto'
import { JwtAuthGuard } from '../../guard/auth.guard'
import { decode } from 'punycode'

@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  /**
   * 获取所有用户，暂无业务使用场景
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const result = await this.userService.findAll()
    return result
  }

  /**
   * 创建用户，使用场景：注册
   * @param user : 用户数据
   */
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    const result = await this.userService.createUserDO(user)
    return result
  }

  /**
   * 用户登录，成功登录会签发token，使用场景：登录页面，暂时只支持使用注册邮箱登录
   * @param user : { loginName: string, password: string }
   */
  @Post('login')
  async loginUser(@Body() user: LoginUserDto) {
    return await this.userService.userLoginService(user)
  }

  /**
   * 判断用户名是否可用，使用场景：注册页面，用户输入名字的时候动态检测该名字是否可用，别等到提交的时候才进行提示
   * @param params : 页面路径动态匹配
   */
  @Get('checkNameAvailable/:name')
  async checkNameAvailable(@Param('name') name) {
    name = decodeURIComponent(name)
    return await this.userService.isNameExistService(name)
  }

  @Get('checkEmailAvailable/:email')
  async checkEmailAvailable(@Param('email') email) {
    email = decodeURIComponent(email)
    return await this.userService.isEmailExistService(email)
  }
}