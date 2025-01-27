import WebSocket from 'ws';
import readline from 'readline';
import { CLIENT_CLOSED, CLIENT_CONNECTED, SERVER_SHUTTING_DOWN, CLIENT_PROMPT, SERVER_PROMPT, SERVER_SUCCESSFUL_NAME, HELP_ADVICE, SEND_COMMAND, SEND_TO_COMMAND, CLOSE_COMMAND, SET_NAME_COMMAND, HELP_COMMAND, CLEAR_COMMAND } from '../utils/utils.js';
import { printHelp } from './commands/commands.js';

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
         ws.send(JSON.stringify({option:SET_NAME_COMMAND,arg:username}))
         // setting the prompt and the username
         setWS(`<USER ${username}> `,username,ws)
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
 
      // parse the data
      const parsed_data = JSON.parse(data);
      // i destructure the parsed data and i assign a new name to prompt because it conflicts with the prompt() function
      const { prompt:new_prompt,msg } = parsed_data;
      // if the new name is changeds successfully, set the new elements 
      if(new_prompt === SERVER_PROMPT && msg === SERVER_SUCCESSFUL_NAME) setWS(`<USER ${parsed_data.new_username}> `,parsed_data.new_username,ws);

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
      // /send <msg>
      case SEND_COMMAND: ws.send(JSON.stringify({option:SEND_COMMAND,arg: args.slice(1).join(' ')}));
         break;
      // /send-to <username> <msg>
      case SEND_TO_COMMAND: ws.send(JSON.stringify({ option:SEND_TO_COMMAND, arg:{ user:args[1], msg:args.slice(2).join(' ') }}));
         break;
      // /close
      case CLOSE_COMMAND: closeClient(ws);
         return false;
      // /set-name <name>
      case SET_NAME_COMMAND: ws.send(JSON.stringify({option:SET_NAME_COMMAND,arg:args[1]}));
         break;
      // /clear
      case CLEAR_COMMAND: clearChat();
         break;
      // /help
      case HELP_COMMAND: printHelp();
         break;
      default: console.log(HELP_ADVICE);
         break;
   }
   rl.prompt();
}

function prompt(prompt){
   rl.setPrompt(prompt);
   rl.prompt();
}

// sets the ws elements i need for the 'message' event
function setWS(prompt,username,ws){
   ws.username = username;
   ws.prompt = prompt;
}

function clearChat() {
   process.stdout.write('\x1B[2J\x1B[0f');
 }