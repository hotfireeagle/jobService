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
- [ ] 对前端所传参数做校验