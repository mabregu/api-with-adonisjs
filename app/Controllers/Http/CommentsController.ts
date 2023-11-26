import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CommentValidator from 'App/Validators/CommentValidator'

export default class CommentsController {
  public async store({ request, params, auth, response }: HttpContextContract) {
    const { content } = await request.validate(CommentValidator)

    const post = await Post.findOrFail(params.post_id)

    const comment = await post.related('comment').create({
      userId: auth.user?.id,
      content,
    })

    await comment.preload('user')
    await comment.preload('post')

    return response.created({ data: comment })
  }
}
