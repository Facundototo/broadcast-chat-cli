import WebSocket from 'ws';
import readline from 'readline';
import { CLIENT_CLOSED, SERVER_SHUTTING_DOWN, CLIENT_PROMPT, SERVER_PROMPT, SERVER_SUCCESSFUL_NAME, HELP_ADVICE, SEND_COMMAND, SEND_TO_COMMAND, CLOSE_COMMAND, SET_NAME_COMMAND, HELP_COMMAND, CLEAR_COMMAND, JOIN_CHANNEL_COMMAND,printChatChannel, SERVER_CHANNEL_JOINED, LIST_CHANNELS_COMMAND, LIST_USERS_COMMAND, SERVER_USERS_FILTERED_BYCHANNEL } from '../../utils/messages.js';
import { clearChat, listChannels, listUsers, printHelp } from '../commands/commands.js';
import { sendTo } from '../../utils/utils.js';

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
         sendTo(ws,{option:SET_NAME_COMMAND,arg:username});
         // setting the prompt and the username
         setWS(`<USER ${username}> `,username,ws)
      } 

      // when the user opens the connection, joins to #general channel 
      ws.channel = '#general';
      printChatChannel(ws.channel,prompt);

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
      const { prompt:new_prompt,msg,show_msg } = parsed_data;
      
      if(new_prompt === SERVER_PROMPT){
         switch(msg){
            // if the new name changed successfully, set the new elements 
            case SERVER_SUCCESSFUL_NAME: setWS(`<USER ${parsed_data.new_username}> `,parsed_data.new_username,ws);
               break;
            // join a channel
            case SERVER_CHANNEL_JOINED:
               ws.channel = parsed_data.channel;
               printChatChannel(ws.channel,prompt);
               break;
            // print the users (/list-users)
            case SERVER_USERS_FILTERED_BYCHANNEL: listUsers(ws,parsed_data.users);
               break;
         }
      }
      

      // if the new_prompt is equal to my prompt, print <ME>
      prompt((new_prompt === ws.prompt)?'<ME> ':new_prompt);

      (show_msg) && console.log(msg.toString());

      if(new_prompt === SERVER_PROMPT && msg === SERVER_SHUTTING_DOWN) closeClient(ws);
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
      case SEND_COMMAND: sendTo(ws,{option:SEND_COMMAND,arg: args.slice(1).join(' ')});
         break;
      // /send-to <username> <msg>
      case SEND_TO_COMMAND: sendTo(ws,{option:SEND_TO_COMMAND, arg:{ user:args[1], msg:args.slice(2).join(' ') }});
         break;
      // /close
      case CLOSE_COMMAND: closeClient(ws);
         return false;
      // /set-name <name>
      case SET_NAME_COMMAND: sendTo(ws,{option:SET_NAME_COMMAND,arg:args[1]});
         break;
      // /join <channel>
      case JOIN_CHANNEL_COMMAND: sendTo(ws,{option:JOIN_CHANNEL_COMMAND,arg:args[1]});
         break;
      // /list-channels
      case LIST_CHANNELS_COMMAND: listChannels(ws);
         break;
      // /list-users
      case LIST_USERS_COMMAND: sendTo(ws,{option:LIST_USERS_COMMAND,arg: args[1] ?? undefined });
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