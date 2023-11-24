import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostValidator from 'App/Validators/PostValidator'

export default class PostController {
  public async store({ request, auth }: HttpContextContract) {
    const validatedData = await request.validate(PostValidator)

    const post = await auth.user?.related('post').create(validatedData)

    await post?.preload('user')
    await post?.preload('category')

    return post
  }
}
