import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from '../../constant'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '30s' }, })
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}