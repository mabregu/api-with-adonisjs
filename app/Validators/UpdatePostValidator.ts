import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({}, [rules.minLength(3), rules.maxLength(255)]),
    content: schema.string.optional(),
    category_id: schema.number.optional([rules.exists({ table: 'categories', column: 'id' })]),
  })

  public messages: CustomMessages = {}
}
