import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class UserMigration1620137279687 implements MigrationInterface {
  private table = new Table({
    name: 'esc_users',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'name',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'email',
        type: 'varchar',
        isUnique: true,
        isNullable: false,
      },
      {
        name: 'password',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'role',
        type: 'enum',
        enum: ['acountant', 'customer', 'admin'],
        default: "'customer'",
      },
      {
        name: 'status',
        type: 'enum',
        enum: ['pendent', 'active'],
        default: "'pendent'",
      },
      {
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        default: null,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
      },
    ],
  })

  async up(queryRunner: QueryRunner) {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await queryRunner.createTable(this.table, true)
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable(this.table)
  }
}
