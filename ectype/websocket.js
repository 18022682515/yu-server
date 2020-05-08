const WebSocketServer = require('websocket').server;

module.exports = server=>{
    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });
    wsServer.on('request',request =>{ 
        const connection = request.accept('echo-protocol', request.origin); 
        connection.on('message', message => {
            connection.sendUTF("给客户端发消息");
        });
        connection.on('close', (reasonCode, description) => {});
    })
}
