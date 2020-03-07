import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Email } from './email.entity'
import { SUCCED_STATUS, ERROR_STATUS } from '../../constant'
import nodemailer from 'nodemailer'
import appConf from '../../../ormconfig.json'

@Injectable()
export class EmailService {

  mailServer: any                                                      // 发送邮件的客户端

  dayMaxSendTimes = 10                                                 // 一个帐号每天所能够发送验证码的次数

  freezeTime = 60 * 1000                                               // 每两次验证码的最小事件间隔，以毫秒为单位

  dayTime = 24 * 60 * 60 * 1000                                        // 一天的毫秒数

  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {
    this.mailServer = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: { user: 'hotfireeagle@163.com', pass: appConf.emailPass, }
    })
  }

  /** 
   * 产生随机的六位数验证码，可能产生重复的没关系
   */
  generateRandomCode(): string {
    const result = []
    for (let i = 0; i < 6; i++) {
      const num = Math.round(Math.random() * 9)
      result.push(num)
    }
    return result.join('')
  }

  /**
   * 计算两者的时间差
   * @param currentTime : 当前时间值
   * @param lastTime : 上个时间值
   */
  computeDateSub(currentTime, lastTime): number {
    return new Date(currentTime).valueOf() - new Date(lastTime).valueOf()
  }

  /**
   * 检查参数一是否是比参数二更大
   */
  bigThan = (num1: number, num2: number) => (num1 - num2) > 0

  /**
   * 当可以发送验证码的时候，在这里完成对数据进行更新的逻辑操作
   * @param email : 邮箱帐号
   * @param code : 发给该邮箱的验证码
   * @param lastSendTime : 最近一次发送验证码的时间
   * @param number : 最新的当前帐号所发送验证码的次数
   */
  async canSendUpdateDbWork(email: string, code: string, lastSendTime: Date, count: number) {
    const emailDiffObj: any = { lastSendTime, count, code }
    await this.emailRepository.update({ email }, emailDiffObj)
  }

  /**
   * 第一次发送验证码的时候进行一个时间存储
   * @param email : 邮箱帐号
   * @param time : 发送邮件的时间
   */
  async canSendSaveDbWork(email: string, code: string, lastSendTime: Date) {
    const emailObj = { email, code, count: 1, lastSendTime }
    await this.emailRepository.save(emailObj)
  }

  /**
   * 判断该邮箱是否可以发送验证码，一分钟内只能发一次，一个用户一天只能发十次
   * @param email : 邮箱号
   * @param currentTimeValue : 当前时间的number值
   * @return { status: boolean, message: string } : status表示是否可以发送，message表示描述信息
   */
  async checkCanSend(email: string, currentTimeValue: Date, code: string): Promise<any> {
    const emailData = await this.emailRepository.findOne({ email })
    if (!emailData) {                                                 // 该帐号从来没有在平台中发送过验证码
      await this.canSendSaveDbWork(email, code, currentTimeValue)
      return { status: true, message: null }
    } else {                                                          // 该帐号在平台中存在发送记录，这里就不考虑手动插入数据库的脏数据了
      if (emailData.count >= this.dayMaxSendTimes) return { status: false, message: `一天最多发送${this.dayMaxSendTimes}条验证码，您已超出` } 　// 已经超过一天的限制数量了
      if (this.bigThan(this.computeDateSub(currentTimeValue, emailData.lastSendTime), this.dayTime)) {    // 时间间隔超过了一天
        await this.canSendUpdateDbWork(email, code, currentTimeValue, 0)                                  // 当天发出数量重置为0
        return { status: true, message: null }
      }
      if (this.bigThan(this.computeDateSub(currentTimeValue, emailData.lastSendTime), this.freezeTime)) { // 判断同一天内的两次发送是否超过最小间隔时间                                                   // 
        await this.canSendUpdateDbWork(email, code, currentTimeValue, emailData.count + 1)
        return { status: true, message: null }
      } else {
        return { status: false, message: `两次验证码发送的间隔不能低于${this.freezeTime / 1000}s` }
      }
    }
  }

  /**
   * 发送邮件的方法
   * @param email : 邮箱帐号
   * @param code : 所需要发送的数据
   */
  async sendEmail(email: string, code: string) {
    await this.mailServer.sendMail({
      from: '"职位招聘平台" <hotfireeagle@163.com>',
      to: email,
      subject: '验证码',
      html: `<b style="font-size:16px;">${code}</b>`
    })
  }
  
  /**
   * 给指定邮箱用户发送验证码
   * @param mobile : 需要发送邮件的邮箱号
   */
  async registerEmailService({ email }) {
    const currentTimeValue = new Date()                                // 当前时间
    const code: string = this.generateRandomCode()                     // 验证码
    const statusObj = await this.checkCanSend(email, currentTimeValue, code)
    if (statusObj.status) {                                            // 可以发送验证码
      try {
        await this.sendEmail(email, code)
        return { status: SUCCED_STATUS, message: '成功发送' }
      } catch(err) {
        return { status: ERROR_STATUS, message: '发送邮件的过程发生了错误' }
      }
    } else {
      return { status: ERROR_STATUS, meessage: statusObj.message }
    }
  }
}