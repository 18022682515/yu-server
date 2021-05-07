const { getAllFiles } = require('yu-node');
const path = require('path');


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


module.exports = { getTasks }
