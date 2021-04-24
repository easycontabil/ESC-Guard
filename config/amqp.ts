import Env from '@secjs/env'

export default {
  /*
  |--------------------------------------------------------------------------
  | RabbitMQ AMQP Configuration
  |--------------------------------------------------------------------------
  |
  | Values used to export RabbitMQ Configuration to queue stuffs inside application.
  |
  */

  rabbitmq: {
    name: Env('MQ_NAME', 'rabbitmq'),
    hostname: Env('MQ_HOST', 'localhost'),
    port: Env('MQ_PORT', 5672),
    vhost: Env('MQ_USERVHOST', 'test'),
    username: Env('MQ_USERVHOST', 'test'),
    password: Env('MQ_PASSWORD', 'test'),
    protocol: Env('MQ_PROTOCOL', 'amqp'),
  },
}
