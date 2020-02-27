import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userName: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  varifyCode: string
}