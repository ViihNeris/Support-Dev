import { BaseSchema } from '@adonisjs/lucid/schema'

export default class User extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // ID, chave primária

      table.string('email').notNullable().unique() // Campo de email
      table.string('password').notNullable() // Campo de senha
      table.enum('role', ['manager', 'candidate']).notNullable() // Campo de role
      table.string('full_name').nullable() // Campo de nome completo

      table.timestamp('created_at').defaultTo(this.raw('CURRENT_TIMESTAMP')) // Timestamp de criação
      table.timestamp('updated_at').defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')) // Timestamp de atualização
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
