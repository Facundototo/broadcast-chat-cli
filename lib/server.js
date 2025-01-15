import { WebSocketServer } from 'ws';


export const startServer = () => {

    const wss = new WebSocketServer({port:8080});

    wss.on('connection',(ws) => {
        console.log('client connected!');
    })

}