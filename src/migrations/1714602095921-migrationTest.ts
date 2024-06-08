import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationTest1714602095921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE "users" SET "isAdmin" = true',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE "users" SET "isAdmin" = false'
    );
  }
}
