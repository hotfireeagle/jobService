import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Email } from '../email/email.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from '../../constant'
import { JwtStrategy } from './auth.strategy'
// import { EmailService } from '../email/email.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Email]),
    JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '30s' }, })
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}