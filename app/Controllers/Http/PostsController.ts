import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CreatePostValidator from 'App/Validators/CreatePostValidator'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator'

export default class PostController {
  public async index() {
    const posts = await Post.query().preload('user').preload('category').preload('comment')

    return posts
  }

  public async store({ request, auth }: HttpContextContract) {
    const validatedData = await request.validate(CreatePostValidator)

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
      .preload('comment')
      .firstOrFail()

    return post
  }

  public async update({ request, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    const validatedData = await request.validate(UpdatePostValidator)

    post.merge(validatedData)
    await post.save()

    await post.preload('user')
    await post.preload('category')
    await post.preload('comment')

    return post
  }

  public async destroy({ params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    return await post.delete()
  }
}
