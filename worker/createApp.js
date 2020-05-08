const { getType } = require('yu-util');
const color = require('../color/consoleColor.js');

function getProxy(obj) {

    function childProxy(obj,attrName) {
        obj.expires = Date.now()+1000*60*60*24*15;
        return new Proxy(obj,{
            set(target,attr,val,p){
                let res = Reflect.set(target,attr,val,p);
                // process.send({ [attrName]:p });
                return res;
            }
        });
    }
    return new Proxy(obj,{
        set(target,attr,val,p){
            if(getType(attr)==='String' && attr.startsWith('sess_id')){
                return Reflect.set(target,'_'+attr,val,p);
            }

            return Reflect.set(target,attr,val,p);
        },
        get(target,attr,p){
            
            if(getType(attr)==='String' && attr.startsWith('sess_id')){
                let res = Reflect.get(target,'_'+attr,p);
                if(getType(res)!=='Object') return;
                return childProxy(res,attr);
            }
            // if(!Reflect.has(target,attr)) return;
            return Reflect.get(target,attr,p);
        },
        deleteProperty(target, attr){
            if(getType(attr)==='String' && attr.startsWith('sess_id')){
                // process.send({ delete_id:'_'+attr });
                return true;
            }
            // if(!Reflect.has(target,attr)) return;
            return Reflect.deleteProperty(target,attr);
        }
    });
}



function setCache(app){
    app._cache = {};
    let cache = null;

    function setProxy(obj,parentAttr){
        return new Proxy(obj,{
            set(target,attr,val,p){
                let res = Reflect.set(target,attr,val,p);
                if(parentAttr) cache = p;
                // process.send({ cache });
                return res;
            },
            get(target,attr,p){
                let res = Reflect.get(target,attr,p);
                if(getType(res)==='Object' || getType(res)==='Array'){
                    return setProxy(res);
                }else{
                    return res;
                }
            }
        });
    }

    return new Proxy(app,{
        set(target,attr,val,p){
            if(attr==='cache'){
                if(getType(val)!=='Object'){
                    console.log(color['red'],'错误：app.cache只能是对象');
                    return;
                }
                let res = Reflect.set(target,'_cache',val,p);
                // process.send({ cache:val });
                return res;
            }
            return Reflect.set(target,attr,val,p);
        },
        get(target,attr,p){
            if(attr==='cache'){
                let res = Reflect.get(target,'_cache',p);
                return setProxy(res,attr);
            }
            // if(!Reflect.has(target,attr)) return;
            return Reflect.get(target,attr,p);
        }
    });

}

module.exports = app=>{
    app.context = getProxy(app.context||{});
    app.taskList = [];
    global.app = setCache(app);
    return global.app;
}