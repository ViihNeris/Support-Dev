import { schema } from '@adonisjs/core/validator';

export const CreateJobApplicationSchema = schema.create({
  name: schema.string(),
  birthDate: schema.date(),
  email: schema.string({}, [rules.email()]),
  phone: schema.string(),
  address: schema.string(),
  zipCode: schema.string(),
  educations: schema.array().members(schema.object().members({
    courseName: schema.string(),
    institutionName: schema.string(),
    graduationDate: schema.date(),
  })),
  skills: schema.array().members(schema.string()),
});
