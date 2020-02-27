### 1.项目介绍

使用typescript + nest.js + typeorm + mysql实现工作招聘系统的服务端部分．

### 2.运行前准备

+ 1.本地安装好mysql数据库，然后修改src目录下config.ts文件里面的用户名以及密码．
+ 2.创建一个数据库，名字叫做jobService.
+ 3.npm i 安装依赖．
+ 4.npm run start运行.
       
### 3.TODOS

- [x] 不允许密码推送到远程应该放到commit阶段
- [ ] npm scripts && 有时间可以增加对windows的支持
- [ ] 感觉不是很快，减少新增用户耗时
- [x] 对前端所传参数做校验
- [x] 参数校验所报的错误格式化一下
- [x] 错误提示应该简洁明了，使得非技术人员操作起来也能够一眼看懂
- [ ] 用户表重新设计一下，并且后续需要引入jwt
- [x] user表迁移
- [x] 由于在表的时候用到了typeorm的json配置，那么之前的config.ts文件中的数据库配置进行一个修改避免存在两处配置数据
- [ ] 既然数据库的有些字段有长度限制，那么在参数校验这一环应该增加长度校验（耗时？）

### 4.表迁移

修改表结构真麻烦，在初次定义表结构的时候还是需要考虑清楚业务

+ 1.在项目根目录中创建一个ormconfig.json文件，给它配置生成migration的目录．
+ 2.使用typeorm migration:create -n Name．(确保typeorm可访问即可)
+ 3.编写迁移逻辑，可以参看[该链接](https://typeorm.io/#/migrations)
+ 4.执行迁移使用命令:　ts-node ./node_modules/typeorm/cli.js migration:run（如果是ts的话），如果是js项目的话，那么直接使用typeorm migration:run即可.
+ 5.执行回退操作: ts-node ./node_modules/typeorm/cli.js migration:revert