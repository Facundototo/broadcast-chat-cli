import WebSocket from 'ws';
import readline from 'readline';
import { CLIENT_CLOSED, CLIENT_CONNECTED, SERVER_SHUTTING_DOWN, SERVER_PROMPT, CLIENT_PROMPT } from '../utils/messages.js';

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

export const connectToServer = () => {

   const ws = new WebSocket('ws://localhost:8080');

   // the 'open' event is called when the connection is established
   ws.on('open', () => {
      console.log(CLIENT_CONNECTED);
      prompt(CLIENT_PROMPT);
   })

   // the 'SIGINT' event is emitted whenever the input stream receives a Ctrl+C input
   rl.on('SIGINT', () => {
      closeClient(ws);
   })

   // the 'line' event captures inputs
   rl.on('line', (input) => {
      const args = input.split(' ');
      manageInput(args,ws);
   })

   // the 'message' event is called when a message arrives from the server
   ws.on('message', (message) => {
 
      prompt(SERVER_PROMPT);

      console.log(message.toString());

      if(message.toString() === SERVER_SHUTTING_DOWN) closeClient(ws);
      else prompt(CLIENT_PROMPT);
   });

}

// closes the client session
function closeClient(ws){
   rl.close();
   ws.close();
   console.log(CLIENT_CLOSED);
}

// manages the client input
function manageInput(args,ws) {

   switch(args[0]){
      //send <msg>
      case 'send':
         const msg = args.slice(1).join(' ');
         ws.send(JSON.stringify({option:'send-to-all',arg: msg}));
         break;
      //close
      case 'close':
         closeClient(ws);
         return false;
      //help
      //set-name <name>
      case 'set-name':
         ws.send(JSON.stringify({option:'set-name',arg:args[1]}));
         break;
   }
   rl.prompt();
}

function prompt(prompt){
   rl.setPrompt(prompt);
   rl.prompt();
}





