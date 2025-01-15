import { WebSocket } from 'ws';


export const connectToServer = () => {

   const ws = new WebSocket('ws://localhost:8080');

   ws.on('open', () => {
        console.log('Connecting to the server...');
   })

}