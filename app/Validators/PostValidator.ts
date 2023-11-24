import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({}, [rules.minLength(3), rules.maxLength(255)]),
    content: schema.string(),
    category_id: schema.number([rules.exists({ table: 'categories', column: 'id' })]),
  })

  public messages: CustomMessages = {}
}
