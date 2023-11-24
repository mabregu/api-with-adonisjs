import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'

export default class PostController {
  public async index() {
    const posts = await Post.query().preload('user').preload('category')

    return posts
  }

  public async store({ request, auth }: HttpContextContract) {
    const validatedData = await request.validate(PostValidator)

    const post = await auth.user?.related('post').create(validatedData)

    await post?.preload('user')
    await post?.preload('category')

    return post
  }

  public async show({ params }: HttpContextContract) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('user')
      .preload('category')
      .firstOrFail()

    return post
  }
}
