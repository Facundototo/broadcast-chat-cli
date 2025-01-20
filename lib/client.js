import WebSocket from 'ws';
import readline from 'readline';
import { CLIENT_CLOSED, CLIENT_CONNECTED, SERVER_SHUTTING_DOWN, CLIENT_TYPE } from '../utils/messages.js';

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

export const connectToServer = () => {

   const ws = new WebSocket('ws://localhost:8080');

   // the 'open' event is called when the connection is established
   ws.on('open', () => {
      console.log(CLIENT_CONNECTED);
      type(CLIENT_TYPE);
   })

   // the 'SIGINT' event is emitted whenever the input stream receives a Ctrl+C input
   rl.on('SIGINT', () => {
      closeClient(ws);
   })

   // the 'message' event is called when a message arrives from the server
   ws.on('message', (message) => {
 
      rl.write(message.toString());

      if(message.toString() === SERVER_SHUTTING_DOWN){
         closeClient(ws);
      }else{
         type(CLIENT_TYPE);
      }

   });

}

// writes a mark on the interface (rl) to indicate the chat session 
function type(r) {
   rl.question(r, (answer) => {
      // process answer
      type(r);
   })
}

// closes the client session
function closeClient(ws){
   rl.close();
   ws.close();
   console.log(CLIENT_CLOSED);
}



