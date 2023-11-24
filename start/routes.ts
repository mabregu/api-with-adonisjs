import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('auth/register', 'AuthController.register')
  Route.post('auth/login', 'AuthController.login')

  Route.post('post', 'PostController.store').middleware('auth')
  Route.get('post/:id', 'PostController.show')
  Route.get('post', 'PostController.index')
  Route.patch('post/:id', 'PostController.update')
}).prefix('api')
