import { Injectable, HttpException, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ERROR_STATUS } from '../constant'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  /** 不管有没有token，token是否有效，这个方法都会被执行 */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  /** 
   * token有效(签证能对上，时间没过期)，canActive -> auth.strategy.validate -> handleRequest
   * token无效，canActive -> handleRequest
   * 综上所述，handle一定是鉴权器的最后一环
   */
  handleRequest(err, user) {
    if (err || !user) {
      throw new HttpException({　status: ERROR_STATUS,　message: '未登录'　}, 200)
    }
    return user
  }

}