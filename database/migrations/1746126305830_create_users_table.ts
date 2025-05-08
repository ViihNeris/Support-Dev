import { BaseSchema } from '@adonisjs/lucid/schema'

export default class User extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.enum('role', ['manager', 'candidate']).notNullable()
      table.string('full_name').nullable()

      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP'))
      table.timestamp('updated_at').defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
