import { IsEmail, MinLength, MaxLength } from 'class-validator'

/**
 * 使用邮箱来获取验证码时的类型约束
 */
export class EmailDto {
  @IsEmail()
  @MinLength(3, { message: '邮箱长度至少为３位' })
  @MaxLength(128, { message: '邮箱长度最多为128位' })
  email: string
}