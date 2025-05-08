import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'job_applications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('name').notNullable()
      table.date('birth_date').notNullable()
      table.string('email').notNullable()
      table.string('phone').notNullable()
      table.string('address').notNullable()
      table.string('zip_code').notNullable()

      table.json('educations').nullable() // array de objetos
      table.json('skills').nullable() // array de strings

      table
        .enu('status', ['pending', 'refused', 'approved'])
        .notNullable()
        .defaultTo('pending')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
