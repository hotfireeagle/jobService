import { DatabaseConf } from '../src/config'

if (DatabaseConf.password) throw new Error('不允许提交密码！')