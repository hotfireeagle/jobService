import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './module/user/user.module'
import { ConnectionOptions } from 'typeorm'
import { DatabaseConf } from './config'

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConf as ConnectionOptions),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}