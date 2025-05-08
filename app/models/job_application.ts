import { DateTime } from 'luxon'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, beforeSave, afterFetch } from '@adonisjs/lucid/orm';
import User from '#models/user'
import { Education } from '#dto/data_received.dto'

export default class JobApplication extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @hasOne(() => User)
  declare user: HasOne<typeof User>

  @column()
  declare name: string

  @column.date()
  declare birthDate: DateTime

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare address: string

  @column()
  declare zipCode: string

  @column()
  declare educations: Education[] | string

  @column()
  declare skills: string[] | string

  @column()
  declare status: 'pending' | 'refused' | 'approved'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeSave()
  public static serializeFields(application: JobApplication) {
    application.skills = JSON.stringify(application.skills);
    application.educations = JSON.stringify(application.educations);
  }

  @afterFetch()
  public static deserializeFields(application: JobApplication) {
    application.skills = JSON.parse(application.skills as unknown as string);
    application.educations = JSON.parse(application.educations as unknown as string);
  }
}
