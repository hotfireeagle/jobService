import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 查找所有用户
   */
  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find()
  }

  /**
   * 查找指定用户
   * @param id : 用户ID
   */
  findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id)
  }

  /**
   * 删除指定用户
   * @param id : 用户ID
   */
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }

  async createUserDO(userObj): Promise<UserEntity> {
    return this.userRepository.save(userObj)
  }
}