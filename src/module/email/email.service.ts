import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Email } from './email.entity'
import { ERROR_STATUS } from '../../constant'

@Injectable()
export class EmailService {

  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {}

  dayMaxSendTimes = 10                                                 // 一个帐号每天所能够发送验证码的次数

  freezeTime = 60 * 1000                                               // 每两次验证码的最小事件间隔，以毫秒为单位

  dayTime = 24 * 60 * 60 * 1000                                        // 一天的毫秒数

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
   * 判断两次发送验证码的事件间隔是不是已经超过最小的时间间隔
   * @param currentTime : 当前时间
   * @param beforeTime : 上次发送时间
   */
  checkIntervalMoreThenFreezeTime(currentTime, beforeTime): boolean {
    return (currentTime - beforeTime) >= this.freezeTime
  }

  /**
   * 判断两次发送验证码的时间间隔是不是已经超过一天了
   * @param currentTime : 当前时间
   * @param firstTime : 第一次发送时间
   */
  checkIntervalMoreThenDayTime(currentTime, firstTime): boolean {
    return (currentTime - firstTime) >= this.dayTime
  }

  /**
   * 当可以发送验证码的时候，在这里完成对数据进行更新的逻辑操作
   * @param email : 邮箱帐号
   * @param lastSendTime : 如果需要更新最近一次发送验证码的时间的话，那么存在这个值
   * @param number : 最新的当前帐号所发送验证码的次数
   * @param firstSendTime : 如果需要更新当天第一次发送验证码的时间的话，那么存在这个值
   */
  async canSendUpdateDbWork(email: string, lastSendTime: number, count: number, firstSendTime?: number) {
    const emailDiffObj: any = { lastSendTime, count }
    firstSendTime && (emailDiffObj.firstDiffObj = firstSendTime)
    await this.emailRepository.update({ email }, emailDiffObj)
  }

  /**
   * 判断该邮箱是否可以发送验证码，一分钟内只能发一次，一个用户一天只能发十次
   * @param email : 邮箱号
   * @param currentTimeValue : 当前时间的number值
   * @return { status: boolean, message: string } : status表示是否可以发送，message表示描述信息
   */
  async checkCanSend(email, currentTimeValue): Promise<any> {
    const emailData = await this.emailRepository.findOne({ email })
    if (emailData.count >= this.dayMaxSendTimes) return { status: false, message: `一天最多发送${this.dayMaxSendTimes}条验证码，您已超出` } 　// 已经超过一天的限制数量了
    if (emailData.lastSendTime) {                                     // 存在上次发送时间，下面把不存在firstSendTime数据按照else分支进行简单处理(只有脱离代码外从手动操作数据库才有可能出现这种脏数据)
      if (emailData.firstSendTime && this.checkIntervalMoreThenDayTime(currentTimeValue, emailData.firstSendTime)) {    // 存在第一次发送时间，但是已经超过了一天限制
        await this.canSendUpdateDbWork(email, currentTimeValue, 0, currentTimeValue)  // 当天发出数量重置为0
        return { status: true, message: null }
      } else if (this.checkIntervalMoreThenFreezeTime(currentTimeValue, emailData.lastSendTime)) {       // 判断同一天内的两次发送是否超过最小间隔时间                                                   // 
        await this.canSendUpdateDbWork(email, currentTimeValue, emailData.count + 1)
        return { status: true, message: null }
      } else {                                                        // 达不到发送验证码的要求，此时不需要更新数据
        return { status: false, message: `两次验证码发送的间隔不能低于${this.freezeTime / 1000}s` }
      }
    } else {                                                          // 不存在lastSendTime的话，统一按照第一次发送验证码进行处理
      await this.canSendUpdateDbWork(email, currentTimeValue, 1, currentTimeValue)
      return { status: true, message: null }
    }
  }

  
  /**
   * 给指定邮箱用户发送验证码
   * @param mobile : 需要发送邮件的邮箱号
   */
  async registerEmail(email) {
    const currentTimeValue = (new Date()).valueOf()                   // 当前时间
    const statusObj = await this.checkCanSend(email, currentTimeValue)
    if (statusObj.status) {

    } else {
      return { status: ERROR_STATUS, meessage: statusObj.message }
    }
  }
}