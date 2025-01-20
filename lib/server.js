import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = 8080;

export const startServer = () => {

    //noServer means that you have to manually create an http server. If you don't want to, just set {port:...} and wss will manage the http server for you
    const wss = new WebSocketServer({noServer:true,clientTracking:true});

    wss.on('connection',(ws) => {

        console.log('client connected!');
        ws.on('error', console.error);

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);   
        })

        ws.on('close', () => {
            console.log('client disconnected');
        })

    })

    process.on('SIGINT', () => closeServer(wss))


    createServer()
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

function closeServer(wss) {

    console.log('closing server');

    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN){
            try {
                client.send('server: shutting down');
            } catch (error) {
                console.error('Error sending to clients',error);
            }
            
        }
    })

    wss.close(() => {
        console.log('server closed');
        process.exit(0);
    });
}

