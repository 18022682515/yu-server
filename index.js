const path = require('path');
const runWorker = require('./worker/worker.js');

module.exports = root=>{
    root = path.resolve(root || './');
    return runWorker(root);
}