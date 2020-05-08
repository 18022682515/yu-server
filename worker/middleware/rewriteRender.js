module.exports = options=>{
    return async (ctx,next)=>{
        let render = ctx.render;
        ctx.render = async function(view,_context){
            _context = _context || {};
            _context._csrf = ctx.session._csrf;
            await render.call(ctx,view,_context);
        }
        return next();
    }
}