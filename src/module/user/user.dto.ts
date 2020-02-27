import { IsString, MinLength, MaxLength, IsEmail　} from 'class-validator'

export class CreateUserDto {
  @IsString({message: '用户名必须为字符串'})
  @MinLength(2, {message: '用户名长度至少为２位'})
  @MaxLength(10, {message: '用户名长度最多为10位'})
  userName: string

  @IsString({message: '密码必须为字符串'})
  @MinLength(6, {message: '密码长度至少为６位'})
  @MaxLength(12, {message: '密码长度最多为12位'})
  password: string

  @IsEmail()
  @MinLength(3, {message: '邮箱长度至少为3位'})
  @MaxLength(128, {message: '邮箱长度至少为128位'})
  email: string

  @IsString({message: '验证码必须为字符串'})
  verifyCode: string
}