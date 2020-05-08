const session = require('koa-generic-session');
const redisStore = require('koa-redis');

module.exports = options=>session({
    store: redisStore(options)
});