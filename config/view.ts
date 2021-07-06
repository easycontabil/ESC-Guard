import { join } from 'path'
import app from 'config/app'

export default {
  /*
  |--------------------------------------------------------------------------
  | View Storage Paths
  |--------------------------------------------------------------------------
  |
  | Most templating systems load templates from disk. Here you may specify
  | an array of paths that should be checked for your views. Of course
  | the usual Laravel view path has already been registered for you.
  |
  */

  paths: {
    mail: [process.cwd() + '/public/Views/Mail'],
    images: join(process.cwd(), 'public', 'static', 'images'),
    staticPath: `${app.prefix}/statics`,
  },
}
