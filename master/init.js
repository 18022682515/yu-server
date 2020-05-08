const path = require('path');
const fs = require('fs');
const { getAllFiles } = require('yu-node');

module.exports = root=>{
    let files = getAllFiles(path.join(__dirname,'../ectype'));
    files.forEach(file=>{
        let readStream = fs.createReadStream(file);
        let obj = path.parse(file);
        let dirPath = obj.name;
        if(obj.ext.includes('html')){
            dirPath = 'static';
        }
        let demoDir = path.resolve(root,dirPath);
        if(fs.existsSync(demoDir)) return;
        fs.mkdirSync(demoDir);
        let fileName = obj.name;
        if(fileName.includes('controller') || fileName.includes('middleware')){
            fileName = fileName.slice(0,6)+'A';
        }
        let writerStream = fs.createWriteStream( path.join(demoDir,fileName+obj.ext) );
        readStream.pipe(writerStream);
    });
}