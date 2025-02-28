import { Server } from '../../utils/messages.js';
import { sendTo } from '../../utils/utils.js';
import { channels } from '../server/channels.js';
import { validateUsernames } from '../server/server.js';
import WebSocket from 'ws';

export function setName(arg,wss,ws){

    const user_exists = validateUsernames(arg,wss);

    // if enters here, it means that there is a client with that username or the username is blank
    if (arg.trim().length === 0 || user_exists){
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.NO_SUCCESSFUL_NAME, showMsg:true});
    }else if(!user_exists){
        //sent to all that a client has changed his name
        if(ws.username) sendToAll(`user "${ws.username}" changed his name to "${arg}"`,Server.PROMPT,ws.channel,wss)
        // set the name in ws.username  
        ws.username = arg; 
        ws.prompt =`<USER ${arg}> `;
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.SUCCESSFUL_NAME,showMsg:true,new_username:arg});
    }

}

// sends a message to all connected clients.
export function sendToAll(msg,prompt,channel,wss){

    wss.clients.forEach(client => {

        // if channel is undefined, the message is for all the users connected
        const channel_to_send = !channel || client.channel === channel

        if(client.readyState === WebSocket.OPEN && channel_to_send){
            try {
                sendTo(client,{prompt, msg, showMsg:true});
            } catch (error) {
                console.error('Error sending message to clients',error);
            }     
        }
    })
}
// sends private messages
export function sendPrivateMessage(arg,ws,wss){
    const { user,msg } = arg;
    const userFind = validateUsernames(user,wss);
    if(!userFind || userFind.username === ws.username){
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.PRIVATE_MESSAGE_ERROR,showMsg:true});
    } else {
        sendTo(userFind,{prompt:`<FROM ${ws.username}> `,msg:msg,showMsg:true});
        sendTo(ws,{prompt:`<TO ${userFind.username}> `,msg:msg,showMsg:true});         
    }
}

export function printHelp(){
    console.log('-- commands --');
    console.log('* start [-p,--port port]// starts the server');
    console.log('* connect [-n,--name username] [-p,--port port]  // connects a client');
    console.log('* help  // all the commands');
    console.log('-- chat commands --');
    console.log('* /send <message>  // sends a message');
    console.log('* /send-to <username> <message>  // sends a private message to a user');
    console.log('* /set-name <name>  // change name');
    console.log('* /join <channel> // join a channel');
    console.log('* /list-channels  // list of existing channels to join');
    console.log('* /list-users  // list of connected users');
    console.log('* /close  // close connection');
    console.log('* /clear  // clears the chat');
    console.log('* /help  // all the commands');
    console.log('---');
 }
// joins a user to a channel
 export function joinChannel(arg,ws){
    const channelFinded = channels.find(channel => channel === arg);
    if(channelFinded){
        ws.channel = channelFinded; 
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.CHANNEL_JOINED,showMsg:true,channel:channelFinded});
    }else{
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.CHANNEL_NOT_FINDED,showMsg:true});
    }
 }
// filters the users by channel (/list-users) 
export function returnClientsByChannel(wss,ws,channelOption){
     
    // if the right-hand is null or undefined it returns that, if not returns the channel finded (nullish coalescing operator)
    const channel = channels.find(channel => channel === channelOption) ?? null;

    const filteredClients = (!channel) ? 
    wss.clients 
    : 
    new Set([...wss.clients].filter(client => client.channel === channel));

    sendTo(ws,{prompt:Server.PROMPT,msg:Server.USERS_FILTERED_BYCHANNEL, showMsg:false, users: [...filteredClients]});
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