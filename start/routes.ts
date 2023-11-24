import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('auth/register', 'AuthController.register')
  Route.post('auth/login', 'AuthController.login')

  Route.post('post', 'PostsController.store').middleware('auth')
  Route.get('post/:id', 'PostsController.show')
  Route.get('post', 'PostsController.index')
  Route.patch('post/:id', 'PostsController.update')
  Route.delete('post/:id', 'PostsController.destroy')

  Route.post('post/:post_id/comment', 'CommentsController.store').middleware('auth')
}).prefix('api')
