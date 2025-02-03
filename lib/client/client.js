import WebSocket from 'ws';
import readline from 'readline';
import { Command,Server,Client,printChatChannel } from '../../utils/messages.js';
import { clearChat, listChannels, listUsers, printHelp } from '../commands/commands.js';
import { sendTo } from '../../utils/utils.js';

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

export const connectToServer = (username,port) => {

   const ws = new WebSocket(`ws://localhost:${port}`);

   // the 'open' event is called when the connection is established
   ws.on('open', () => {

      // if the client sets the '-n' option AND the username is correct, the program sets the username
      if(username !== undefined && username.trim().length > 0){
         sendTo(ws,{option:Command.SET_NAME,arg:username});
         // setting the prompt and the username
         setWS(`<USER ${username}> `,username,ws)
      } 

      // when the user opens the connection, joins to #general channel 
      ws.channel = '#general';
      printChatChannel(ws.channel,prompt);

      prompt(Client.PROMPT);
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
      
      (show_msg) && console.log(msg.toString());

      if(new_prompt === Server.PROMPT){
         switch(msg){
            // if the new name changed successfully, set the new elements 
            case Server.SUCCESSFUL_NAME: setWS(`<USER ${parsed_data.new_username}> `,parsed_data.new_username,ws);
               break;
            // join a channel
            case Server.CHANNEL_JOINED:
               ws.channel = parsed_data.channel;
               printChatChannel(ws.channel,prompt);
               break;
            // print the users (/list-users)
            case Server.USERS_FILTERED_BYCHANNEL: listUsers(ws,parsed_data.users);
               break;
            // server closes
            case Server.SHUTTING_DOWN: closeClient(ws);
               break;
         }
      }
      
      // if the new_prompt is equal to my prompt, print <ME>
      prompt((new_prompt === ws.prompt)?'<ME> ':new_prompt);

      prompt(Client.PROMPT);
   });

}

// closes the client session
function closeClient(ws){
   rl.close();
   ws.close();
   console.log(Client.CLOSED);
   process.exit(0); 
}

// manages the client input
function manageInput(args,ws) {

   switch(args[0]){
      // /send <msg>
      case Command.SEND: sendTo(ws,{option:Command.SEND,arg: args.slice(1).join(' ')});
         break;
      // /send-to <username> <msg>
      case Command.SEND_TO: sendTo(ws,{option:Command.SEND_TO, arg:{ user:args[1], msg:args.slice(2).join(' ') }});
         break;
      // /close
      case Command.CLOSE: closeClient(ws);
         return false;
      // /set-name <name>
      case Command.SET_NAME: sendTo(ws,{option:Command.SET_NAME,arg:args[1]});
         break;
      // /join <channel>
      case Command.JOIN_CHANNEL: sendTo(ws,{option:Command.JOIN_CHANNEL,arg:args[1]});
         break;
      // /list-channels
      case Command.LIST_CHANNELS: listChannels(ws);
         break;
      // /list-users
      case Command.LIST_USERS: sendTo(ws,{option:Command.LIST_USERS,arg: args[1] ?? undefined });
         break;
      // /clear
      case Command.CLEAR: clearChat();
         break;
      // /help
      case Command.HELP: printHelp();
         break;
      default: console.log(Client.HELP_ADVICE);
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