
class Home{
    
    async index(ctx,next){
        // await ctx.render('index');
        ctx.body = '首页';
    }
}

module.exports = Home;