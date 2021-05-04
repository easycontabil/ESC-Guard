import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class UserTokenMigration1620137287348 implements MigrationInterface {
  private table = new Table({
    name: 'esc_user_tokens',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      },
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'token',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'type',
        type: 'enum',
        enum: [
          'access_token',
          'refresh_token',
          'forgot_password',
          'email_confirmation',
        ],
        isNullable: false,
      },
      {
        name: 'expires_in',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'status',
        type: 'enum',
        enum: ['created', 'used'],
        default: "'created'",
      },
      {
        name: 'revoked_at',
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

  private foreignKeys = [
    new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'esc_users',
      name: 'UserTokens',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }),
  ]

  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(this.table, true)
    await queryRunner.createForeignKeys(this.table, this.foreignKeys)
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropForeignKeys(this.table, this.foreignKeys)
    await queryRunner.dropTable(this.table)
  }
}
