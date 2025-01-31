import { Server } from '../../utils/messages.js';
import { sendTo } from '../../utils/utils.js';
import { channels } from '../server/channels.js';
import { validateUsernames } from '../server/server.js';
import WebSocket from 'ws';

export function setName(arg,wss,ws){

    const user_exists = validateUsernames(arg,wss);

    // if enters here, it means that there is a client with that username or the username is blank
    if (arg.trim().length === 0 || user_exists){
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.NO_SUCCESSFUL_NAME, show_msg:true});
    }else if(!user_exists){
        //sent to all that a client has changed his name
        if(ws.username) sendToAll(`user "${ws.username}" changed his name to "${arg}"`,Server.PROMPT,ws.channel,wss)
        // set the name in ws.username  
        ws.username = arg; 
        ws.prompt =`<USER ${arg}> `;
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.SUCCESSFUL_NAME,show_msg:true,new_username:arg});
    }

}

// sends a message to all connected clients.
export function sendToAll(msg,prompt,channel,wss){

    wss.clients.forEach(client => {

        // if channel is undefined, the message is for all the users connected
        const channel_to_send = !channel || client.channel === channel

        if(client.readyState === WebSocket.OPEN && channel_to_send){
            try {
                sendTo(client,{prompt, msg, show_msg:true});
            } catch (error) {
                console.error('Error sending message to clients',error);
            }     
        }
    })
}
// sends private messages
export function sendPrivateMessage(arg,ws,wss){
    const { user,msg } = arg;
    const user_find = validateUsernames(user,wss);
    if(!user_find || user_find.username === ws.username){
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.PRIVATE_MESSAGE_ERROR,show_msg:true});
    } else {
        sendTo(user_find,{prompt:`<FROM ${ws.username}> `,msg:msg,show_msg:true});
        sendTo(ws,{prompt:`<TO ${user_find.username}> `,msg:msg,show_msg:true});         
    }
}

export function printHelp(){
    console.log('-- commands --');
    console.log('* start  // starts the server');
    console.log('* connect [-n,--name username]  // connects a client');
    console.log('* help  // all the commands');
    console.log('-- chat commands --');
    console.log('* /send <message>  // sends a message');
    console.log('* /send-to <username> <message>  // sends a private message to a user');
    console.log('* /set-name <name>  // change name');
    console.log('* /close  // close connection');
    console.log('* /clear  // clears the chat');
    console.log('* /help  // all the commands');
    console.log('---');
 }
// joins a user to a channel
 export function joinChannel(arg,ws){
    const channel_finded = channels.find(channel => channel === arg);
    if(channel_finded){
        ws.channel = channel_finded; 
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.CHANNEL_JOINED,show_msg:true,channel:channel_finded});
    }else{
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.CHANNEL_NOT_FINDED,show_msg:true});
    }
 }
// filters the users by channel (/list-users) 
export function returnClientsByChannel(wss,ws,channel_option){
     
    // if the right-hand is null or undefined it returns that, if not returns the channel finded (nullish coalescing operator)
    const channel = channels.find(channel => channel === channel_option) ?? null;

    const filtered_clients = (!channel) ? 
    wss.clients 
    : 
    new Set([...wss.clients].filter(client => client.channel === channel));

    sendTo(ws,{prompt:Server.PROMPT,msg:Server.USERS_FILTERED_BYCHANNEL, show_msg:false, users: [...filtered_clients]});
}
// prints the channels 
export function listChannels(ws){
    console.log('-- channels --');
    channels.forEach(channel => console.log(` ${channel} ${(channel === ws.channel)?'*':''}`));
    console.log('--------------');
 }
// prints the users and the channels they are on
export function listUsers(ws,users){
    console.log('-- users --');
    users.forEach(user =>  console.log(` ${user.username} (${user.channel}) ${(user.username === ws.username)?'*':''}`));
    console.log('--------------');
}
// clears the terminal
export function clearChat() {
    process.stdout.write('\x1B[2J\x1B[0f');
}