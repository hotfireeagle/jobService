import { IsString, IsInt, IsNotEmpty, MinLength, MaxLength, Min, Max } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(8)
  firstName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(8)
  lastName: string

  @IsInt()
  @Min(1)
  @Max(150)
  age: number
}