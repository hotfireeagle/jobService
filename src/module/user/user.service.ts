import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { SHA256 } from 'crypto-js'
import { JwtService } from '@nestjs/jwt'
import { SUCCED_STATUS, ERROR_STATUS } from '../../constant'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 查找所有用户
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  /**
   * 根据指定信息进行用户查找
   * @param options : [object Object]，能够唯一标识用户的数据
   */
  findOne(options): Promise<User> {
    return this.userRepository.findOne(options)
  }

  /**
   * 删除指定用户
   * @param id : 用户ID
   */
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }

  /**
   * 进行用户创建
   * @param userObj : 用户数据
   */
  async createUserDO(userObj): Promise<User> {
    userObj.password = SHA256(userObj.password).toString()
    return this.userRepository.save(userObj)
  }

  /**
   * 用户登录服务
   */
  async userLoginService(user) {
    const userObj = await this.findOne({email: user.loginName})
    if (userObj) {
      const pwdSaved = userObj.password
      if (SHA256(user.password).toString() === pwdSaved) {
        return { status: SUCCED_STATUS, message: '登录成功', token: this.jwtService.sign({ username: userObj.email, sub: userObj.id }) }  // email是肯定存在的．相对于userName
      } else {
        return { status: ERROR_STATUS, message: '密码错误', token: null }
      }
    } else {
      return { status: ERROR_STATUS, message: '不存在该用户', token: null }
    }
  }

}