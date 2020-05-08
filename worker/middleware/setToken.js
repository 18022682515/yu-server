const crypto = require('crypto');

module.exports = options=>{
    return async (ctx,next)=>{
        if(ctx.session._csrf) return next();
        let hash = crypto.createHash('md5');
        hash.update(`${Date.now()}`);
        let token = hash.digest('hex');
        ctx.session._csrf = token;
        ctx.cookies.set('_csrf',token,{
            maxAge: 1000*60*60*24, // cookie有效时长
            path: '/',       // 该cookie生效的路径
            httpOnly: true,  // 前端js是否可以访问cookie
            overwrite: true,  // 如果设置两个相同的key名，是否后者覆盖前者
            signed: false,    //使用签名 默认true
            encrypt: false,  //是否对cookie加密
        });
        return next();
    }
}