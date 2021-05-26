const log4js = require('log4js');
const path = require('path');

function getDate(){
	let dateTime = new Date();
	let year = dateTime.getFullYear();
	let month = dateTime.getMonth()+1;
	let date = dateTime.getDate();
	return year+'-'+month+'-'+date;
}

module.exports = (root,name)=>{
    log4js.configure({
        appenders:{
						'app-error':{
						    type: 'dateFile',  
						    filename: path.join(root,'logs',getDate(),'app','error'), 
						    pattern: 'log',  // 文件名增加后缀 
						    alwaysIncludePattern: true   // 是否总是有后缀名 
						},
						'app-warn':{
						    type: 'dateFile',  
						    filename: path.join(root,'logs',getDate(),'app','warn'), 
						    pattern: 'log',  // 文件名增加后缀 
						    alwaysIncludePattern: true   // 是否总是有后缀名 
						},
						'app-info':{
						    type: 'dateFile',  
						    filename: path.join(root,'logs',getDate(),'app','info'), 
						    pattern: 'log',  // 文件名增加后缀 
						    alwaysIncludePattern: true   // 是否总是有后缀名 
						},
            'request-error':{
                type: 'dateFile',  
                filename: path.join(root,'logs',getDate(),'request','error'), 
                pattern: 'log',  // 文件名增加后缀 
                alwaysIncludePattern: true   // 是否总是有后缀名 
            },
            'request-warn':{
                type: 'dateFile',  
                filename: path.join(root,'logs',getDate(),'request','warn'), 
                pattern: 'log',  // 文件名增加后缀 
                alwaysIncludePattern: true   // 是否总是有后缀名 
            },
						'request-info':{
						    type: 'dateFile',  
						    filename: path.join(root,'logs',getDate(),'request','info'), 
						    pattern: 'log',  // 文件名增加后缀 
						    alwaysIncludePattern: true   // 是否总是有后缀名 
						}
        },
        categories:{
            default:{ appenders:['app-error'],level:'error' },
						'app-warn':{ appenders:['app-warn'],level:'warn' },
						'app-info':{ appenders: [,'app-info'], level: 'info' },
						'request-error':{ appenders:['request-error'],level:'error' },
						'request-warn':{ appenders:['request-warn'],level:'warn' },
            'request-info': { appenders: ['request-info'], level: 'info' }
        }
    });
    const loggerAppError = log4js.getLogger('app-error');
    const loggerAppWarn = log4js.getLogger('app-warn');
		const loggerAppInfo = log4js.getLogger('app-info');
    const requestError = log4js.getLogger('request-error');
		const requestWarn = log4js.getLogger('request-warn');
		const requestInfo = log4js.getLogger('request-info');
		rewrite(loggerAppError,name);
		rewrite(loggerAppWarn,name);
    rewrite(loggerAppInfo,name);
    rewrite(requestError,name);
		rewrite(requestWarn,name);
		rewrite(requestInfo,name);
		
    return { 
			appLogger:{
				error:loggerAppError.error.bind(loggerAppError),
				warn:loggerAppWarn.warn.bind(loggerAppWarn),
				info:loggerAppInfo.info.bind(loggerAppInfo)
			},
			requestLogger:{
				error:requestError.error.bind(requestError),
				Warn:requestWarn.warn.bind(requestWarn),
				info:requestInfo.info.bind(requestInfo),
			}
		};
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