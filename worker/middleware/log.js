const path = require('path');
const log4js = require('log4js');

module.exports = (logger)=>{
    
    return async (ctx,next)=>{
        ctx.logger = logger;
        const start = Date.now();
        
        await next();
        const end = Date.now()
        const responseTime = end - start;
        logger.info(`访问路径${ctx.path}`,'响应耗时'+responseTime+'ms');
    }
}

