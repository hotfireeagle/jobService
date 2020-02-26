import { IsString, IsInt, MinLength, MaxLength, Min, Max } from 'class-validator'

export class CreateUserDto {
  @IsString({message: 'firstName必须为字符串'})
  @MinLength(2, {message: 'firstName长度至少为２位'})
  @MaxLength(8, {message: 'firstName长度最多为8位'})
  firstName: string

  @IsString({message: 'lastName必须为字符串'})
  @MinLength(2, {message: 'lastName长度至少为２位'})
  @MaxLength(8, {message: 'lastName长度最多为8位'})
  lastName: string

  @IsInt({message: '年龄必须为数字'})
  @Min(1, {message: '年龄最小为１'})
  @Max(150, {message: '年龄最大为150'})
  age: number
}