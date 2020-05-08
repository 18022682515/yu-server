const { getAllFiles } = require('yu-node');
const path = require('path');

function getControllers(dirPath){
    let files = getAllFiles(dirPath);
    let obj = {};
    files.forEach(file=>{
        let pathObj = path.parse(file);
        let fn = require(file);
        obj[pathObj.name] = new fn();
    });
    return obj;
}

function getTasks(dirPath){
    let files = getAllFiles(dirPath);
    let obj = {};
    files.forEach(file=>{
        let pathObj = path.parse(file);
        let fn = require(file);
        obj[pathObj.name] = fn;
    });
    return obj;
}

function getMiddlewares(dirPath){
    let files = getAllFiles(dirPath);
    let obj = {};
    files.forEach(file=>{
        let pathObj = path.parse(file);
        let middleware = require(file);
        obj[pathObj.name] = middleware;
    });
    return obj;
}

module.exports = { getControllers,getTasks,getMiddlewares }
