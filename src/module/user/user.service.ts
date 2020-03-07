import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { Email } from '../email/email.entity'
import { SHA256 } from 'crypto-js'
import { JwtService } from '@nestjs/jwt'
import { SUCCED_STATUS, ERROR_STATUS } from '../../constant'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
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
   * 根据id来查找用户
   * @param id 
   */
  async findUserByIds(ids): Promise<any> {
    const result = await this.userRepository.findByIds(ids)
    if (result && result.length) {
      return {
        id: result[0].id,
        email: result[0].email
      }
    } else {
      return null
    }
  }

  /**
   * 删除指定用户
   * @param id : 用户ID
   */
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }

  /**
   * 进行用户创建，这里也做一个检查，因为单纯依靠前端来实现是不可靠的
   * @param userObj : 用户数据
   */
  async createUserDO(userObj): Promise<any> {
    if (await this.findOne({ userName: userObj.userName })) return { status: ERROR_STATUS, message: '该用户名已被注册' }
    if (await this.findOne({ email: userObj.email })) return { status: ERROR_STATUS, message: '该邮箱已被注册' }
    const codeObjByEmail = await this.emailRepository.findOne({ email: userObj.email })
    if (!codeObjByEmail) return { status: ERROR_STATUS, message: '请先获取验证码' }
    if (codeObjByEmail.code !== userObj.code) return { status: ERROR_STATUS, message: '验证码不正确' }
    userObj.password = SHA256(userObj.password).toString()
    await this.userRepository.save(userObj)
    return { status: SUCCED_STATUS, message: '注册成功' }
  }

  /**
   * 用户登录服务
   */
  async userLoginService(user) {
    const userObj = await this.findOne({ email: user.loginName })
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

  /**
   * 判断用户名是否已被占用
   */
  async isNameExistService(name) {
    const user = await this.findOne({ userName: name })
    if (user) return { status: ERROR_STATUS, message: '该用户名已被注册' }
    else return { status: SUCCED_STATUS, message: '未占用' }
  }


  /**
   * 判断邮箱是否已被占用
   */
  async isEmailExistService(email) {
    const user = await this.findOne({ email })
    if (user) return { status: ERROR_STATUS, message: '该邮箱已被注册' }
    else return { status: SUCCED_STATUS, message: '未占用' }
  }
}