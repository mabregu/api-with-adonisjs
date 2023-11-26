import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SortValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    sort_by: schema.enum.optional([
      'id',
      'user_id',
      'category_id',
      'title',
      'created_at',
      'updated_at',
    ]),
    order: schema.enum.optional(['asc', 'desc'] as const),
  })

  public messages: CustomMessages = {}
}
