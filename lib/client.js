import WebSocket from 'ws';
import readline from 'readline';
import { CLIENT_CLOSED, CLIENT_CONNECTED, SERVER_SHUTTING_DOWN, CLIENT_PROMPT } from '../utils/messages.js';

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

export const connectToServer = (username) => {

   const ws = new WebSocket('ws://localhost:8080');

   // the 'open' event is called when the connection is established
   ws.on('open', () => {

      // if the client sets the '-n' option AND the username is correct, the program sets the username
      if(username !== undefined && username.trim().length > 0){
         ws.send(JSON.stringify({option:'set-name',arg:username}))
         // setting the prompt and the username
         ws.username = username; 
         ws.prompt =`<USER ${username}> `;
      } 

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
   ws.on('message', (data) => {
 
      const { prompt:new_prompt,msg } = JSON.parse(data);

      // if the new_prompt is equal to my prompt, print <ME>
      prompt((new_prompt === ws.prompt)?'<ME> ':new_prompt);
      console.log(msg.toString());

      if(msg.toString() === SERVER_SHUTTING_DOWN) closeClient(ws);
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
      // send <msg>
      case 'send':
         const msg = args.slice(1).join(' ');
         ws.send(JSON.stringify({option:'send-to-all',arg: msg}));
         break;
      // close
      case 'close':
         closeClient(ws);
         return false;
      // help
      // set-name <name>
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





