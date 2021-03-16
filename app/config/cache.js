module.exports = {
  useRedis: process.env.NODE_ENV !== 'test',
  cacheName: 'redisCache', // FIXME: might not need this
  catboxOptions: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined
  }
}
