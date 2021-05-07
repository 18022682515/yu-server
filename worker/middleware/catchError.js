module.exports = ()=>{
    return async (ctx,next)=>{
        await next().catch(err=>{
            ctx.logger.error(err);
            ctx.status = err.statusCode || 500;
            ctx.body = {
                message:err.message
            };
        });
    }
}