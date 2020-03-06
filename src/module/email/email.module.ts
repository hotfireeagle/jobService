import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Email } from './email.entity'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Email])
  ],
  providers: [ EmailService ],
  controllers: [ EmailController ]
})
export class EmailModule {}