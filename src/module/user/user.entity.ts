import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 10})
  userName: string

  @Column({length: 12})
  password: string

  @Column({length: 128})
  email: string

  @Column({length: 8})
  verifyCode: string
}