import { MigrationInterface, QueryRunner } from "typeorm";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class user1582710810704 implements MigrationInterface {

  // 这是数据库迁移的sql操作
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE user_entity DROP COLUMN lastName')         　　　　　　　　　// 把老表的lastName字段给删掉
    await queryRunner.query('ALTER TABLE user_entity DROP COLUMN age')                             // 把老表的age字段给删掉
    await queryRunner.query('ALTER TABLE user_entity CHANGE firstName userName VARCHAR(20) NOT NULL DEFAULT ""') // 把老表的firstName字段改成userName字段
    await queryRunner.query('ALTER TABLE user_entity ADD password VARCHAR(16) NOT NULL DEFAULT ""')  // 给老表新增密码字段，默认值给设置为了空字符串
    await queryRunner.query('ALTER TABLE user_entity ADD verifyCode VARCHAR(6) NOT NULL DEFAULT ""') // 给老表新增验证码字段，后续可以考虑存redis，目前存数据库过期逻辑就交给客户端做了
  }

  // 这是数据库回退的sql操作
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE user_entity DROP COLUMN verifyCode')
    await queryRunner.query('ALTER TABLE user_entity DROP COLUMN password')
    await queryRunner.query('ALTER TABLE user_entity CHANGE userName firstName VARCHAR(20) NOT NULL DEFAULT ""')
    await queryRunner.query('ALTER TABLE user_entity ADD age INT(3) DEFAULT NULL')
    await queryRunner.query('ALTER TABLE user_entity ADD lastName VARCHAR(20) NOT NULL DEFAULT ""')
  }

}
