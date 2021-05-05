import view from './view'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import Env from '@secjs/env'

export default {
  transport: {
    host: Env('SMTP_HOST', ''),
    port: Env({ name: 'SMTP_PORT', type: 'number' }, ''),
    secure: Env({ name: 'SMTP_SSL', type: 'boolean' }, false),
    auth: {
      user: Env('SMTP_USER', ''),
      pass: Env('SMTP_PASSWORD', ''),
    },
  },
  defaults: {
    from: Env('SMTP_DEFAULT_FROM', ''),
  },
  template: {
    dir: view.paths.mail[0],
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}
