import { entity } from './entities'

export const DatabaseConf = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'jobService',
  entities: entity,
  synchronize: true,
}