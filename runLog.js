const log4js = require('log4js');
const path = require('path');

module.exports = (root,name)=>{
    log4js.configure({
        appenders:{
            app:{ 
                type: 'dateFile',  
                filename: path.join(root,'logs','app'), 
                pattern: '-yyyy-MM-dd.log',  // 文件名增加后缀 
                alwaysIncludePattern: true   // 是否总是有后缀名 
            },
            request:{ 
                type: 'dateFile',  
                filename: path.join(root,'logs','request'), 
                pattern: '-yyyy-MM-dd.log',  // 文件名增加后缀 
                alwaysIncludePattern: true   // 是否总是有后缀名 
            }
        },
        categories:{
            default:{ appenders: ['app'], level: 'info' },
            request: { appenders: ['request'], level: 'info' }
        }
    });
    
    const loggerApp = log4js.getLogger('app');
    const loggerRequest = log4js.getLogger('request');
    rewrite(loggerApp,name);
    rewrite(loggerRequest,name);
    return { loggerApp,loggerRequest };
}

function rewrite(logger,name){
    logger.trace = (...args)=>{
        logger.__proto__.trace.call(logger,`[${name}${process.pid}]`,...args);
    }
    logger.debug = (...args)=>{
        logger.__proto__.debug.call(logger,`[${name}${process.pid}]`,...args);
    }
    logger.info = (...args)=>{
        logger.__proto__.info.call(logger,`[${name}${process.pid}]`,...args);
    }
    logger.warn = (...args)=>{
        logger.__proto__.warn.call(logger,`[${name}${process.pid}]`,...args);
    }
    logger.error = (...args)=>{
        logger.__proto__.error.call(logger,`[${name}${process.pid}]`,...args);
    }
    logger.fatal = (...args)=>{
        logger.__proto__.fatal.call(logger,`[${name}${process.pid}]`,...args);
    }
}