import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { ERROR_STATUS } from '../constant'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  /** 实现pipe逻辑的方法 */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.isInWhitelist(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      const message = this.generateError(errors)
      throw new HttpException({status: ERROR_STATUS, message}, HttpStatus.BAD_REQUEST)
    }
    return value
  }

  /** 确定哪些数据无需被校验 */
  private isInWhitelist(metatype: Function): boolean {
    const types: Array<Function> = [String, Boolean, Number, Array, Object] // js的原生类型无需进行
    return types.includes(metatype)
  }

  /** 构造出错误提示数据 */
  private generateError(errors: any[]): string {
    const result = []
    errors.map(errObj => {
      const errDescObj = errObj.constraints
      Object.keys(errDescObj).map(key => { result.push(errDescObj[key]) })
    })
    return result.join('-')
  }
}