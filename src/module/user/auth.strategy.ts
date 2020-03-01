import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { JWT_SECRET } from '../../constant'
import { UserService } from './user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),         // 将token信息放在请求头里面的header头中
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET
    })
  }

  /**
   * 经过内置策略进行验证发现token有效（是我签发，时间有效）的话，会接着执行这个方法
   * 这就行了吗？不行，我们还得验证一下用户是否存在数据库中，万一注销了呢？
   * @param payload : token里面所携带的数据
   */
  async validate(payload: any) {
    return await this.userService.findUserByIds([ payload.sub ])
  }
}