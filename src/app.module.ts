import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './module/user/user.module'
import { ConnectionOptions } from 'typeorm'
import { DatabaseConf } from './config'
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './pipe/validation.pipe'
import { EmailModule } from './module/email/email.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConf as ConnectionOptions),
    UserModule,
    EmailModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}