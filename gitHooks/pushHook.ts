import appConf  from '../ormconfig.json'

if (appConf.password) throw new Error('不允许提交数据库密码！')

if (appConf.emailPass) throw new Error('不允许提交邮箱SMTP授权码')