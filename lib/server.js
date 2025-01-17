const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = 8080;

const startServer = () => {

    //noServer means that you have to manually create an http server. If you don't want to, just set {port:...} and wss will manage the http server for you
    const wss = new WebSocketServer({noServer:true});

    wss.on('connection',(ws) => {
        console.log('client connected!');

        //declare events
    })

    http
    .createServer()
    //listening
    .listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })
    //listens to the event 'upgrade' if a client wants to upgrade to a websocket protocol
    .on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            //call to the 'connection' event
            wss.emit('connection', ws, req);
          });
    })

}

module.exports = { startServer };