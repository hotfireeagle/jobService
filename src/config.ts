import { entity } from './entities'
import baseDbConfig from '../ormconfig.json'

// ormconfig.json文件里面有些配置项不被@nestjs/typeorm支持，所以这里就直接使用这种不好看的方式直接处理
export const DatabaseConf = {
  type: baseDbConfig.type,
  host: baseDbConfig.host,
  port: baseDbConfig.port,
  username: baseDbConfig.username,
  password: baseDbConfig.password,
  database: baseDbConfig.database,
  entities: entity,
  synchronize: true,
}