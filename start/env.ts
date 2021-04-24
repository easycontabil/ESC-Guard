import Log from 'start/debug'

import * as path from 'path'
import * as dotenv from 'dotenv'
;(async function() {
  const environment = process.env.NODE_ENV
  const configurations = { path: path.resolve(__dirname, '..', '..', '.env') }

  if (environment) {
    configurations.path = path.resolve(__dirname, '..', `.env.${environment}`)

    Log.environment(`Environment variables set using .env.${environment}`)
  }

  const result = dotenv.config(configurations)

  if (result.error) {
    Log.environment('Any environment variable file found!')
  }
})()
