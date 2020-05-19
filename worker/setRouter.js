const Router = require('koa-router');
const { getType } = require('yu-util');

function setRouter(controllers,config,router){
	let prefix = config.routesPrefix;
	let files = []
	let childs = {}
	
	Object.keys(prefix).forEach(key=>{
		childs[key] = new Router();
		prefix[key].forEach(val=>{
			files.push(val)
		})
	})
	
	Object.keys(controllers).forEach(key=>{
			controller = controllers[key];
			if(getType(controller)!=='Object') return;
			const fnNames = Object.getOwnPropertyNames(controller.__proto__).filter(val=>{
					return val !== 'constructor';
			});
			if(fnNames.length<1) return;
			
			if( files.includes(key) ){
				
				Object.keys(prefix).forEach(attr=>{
					if(!prefix[attr].includes(key)) return
					
					childs[attr].get('/',controller['index']);
					fnNames.forEach(fnName=>{
						if(getType(controller[fnName])!=='AsyncFunction') return;
						childs[attr].all(`/${fnName}`,controller[fnName])
					})
				})
				return
			}
			
			router.get('/',controller['index']);
			fnNames.forEach(fnName=>{
					if(getType(controller[fnName])!=='AsyncFunction') return;
					router.all(`/${fnName}`,controller[fnName]);
			});
	});
	
	Object.keys(childs).forEach(key=>{
		router.use(key,childs[key].routes(),childs[key].allowedMethods())
	});
	
	router.all('*',async ctx=>{
		ctx.status = 404;
		await ctx.render('404');
	});
}

module.exports = setRouter;