import DatabaseConf  from '../ormconfig.json'

if (DatabaseConf.password) throw new Error('不允许提交密码！')