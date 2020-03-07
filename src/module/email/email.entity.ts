import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 128 })
  email: string                     // 邮箱帐号

  @Column({ length: 6 })
  code: string                      // 验证码

  @Column()
  lastSendTime: Date                // 最近一次验证码所发出去的时间

  @Column()
  count: number                     // 当天发送的次数
}