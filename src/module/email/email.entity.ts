import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Email {
  @PrimaryColumn()
  @Column({ length: 128 })
  email: string                     // 邮箱帐号

  @Column({ length: 6 })
  code: string                      // 验证码

  @Column()
  lastSendTime: number              // 最近一次验证码所发出去的时间

  @Column()
  firstSendTime: number             // 第一次验证码所发出去的时间

  @Column()
  count: number                     // 当天发送的次数
}