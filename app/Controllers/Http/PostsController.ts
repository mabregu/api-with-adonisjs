import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Post from 'App/Models/Post'
import CreatePostValidator from 'App/Validators/CreatePostValidator'
import SortValidator from 'App/Validators/SortValidator'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator'

export default class PostController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 25)
    const userId = request.input('user_id')
    const categoryId = request.input('category_id')

    const validatedData = await request.validate(SortValidator)

    const sortBy = validatedData.sort_by || 'id'
    const order = validatedData.order || 'asc'

    const posts = await Post.query()
      .if(userId, (query) => {
        query.where('user_id', userId)
      })
      .if(categoryId, (query) => {
        query.where('category_id', categoryId)
      })
      .orderBy(sortBy, order)
      .preload('user')
      .preload('category')
      .preload('comment')
      .paginate(page, perPage)

    return response.ok({ data: posts })
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const validatedData = await request.validate(CreatePostValidator)

    const post = await auth.user?.related('post').create(validatedData)

    await post?.preload('user')
    await post?.preload('category')

    return response.created({ data: post })
  }

  public async show({ params, response }: HttpContextContract) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('user')
      .preload('category')
      .preload('comment')
      .firstOrFail()

    return response.ok({ data: post })
  }

  public async update({ request, params, auth, response }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    const validatedData = await request.validate(UpdatePostValidator)

    if (auth.user?.id !== post.userId) {
      throw new UnauthorizedException('You can only edit your own posts.')
    }

    post.merge(validatedData)
    await post.save()

    await post.preload('user')
    await post.preload('category')
    await post.preload('comment')

    return response.ok({ data: post })
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    if (auth.user?.id !== post.userId) {
      throw new UnauthorizedException('You can only delete your own posts.')
    }

    await post.delete()

    return response.noContent()
  }
}
