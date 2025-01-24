import { SERVER_PROMPT, SERVER_NO_SUCCESSFUL_NAME, SERVER_SUCCESSFUL_NAME } from '../../utils/utils.js';
import { validateUsernames } from '../server.js';
import WebSocket from 'ws';

export function setName(arg,wss,ws){

    const user_exists = validateUsernames(arg,wss);

    // if enters here, it means that there is a client with that username or the username is blank
    if (arg.trim().length === 0 || user_exists){
        ws.send(JSON.stringify({prompt:SERVER_PROMPT,msg:SERVER_NO_SUCCESSFUL_NAME}));
    }else if(!user_exists){
        //sent to all that a client has changed his name
        if(ws.username) sendToAll(`user "${ws.username}" changed his name to "${arg}"`,SERVER_PROMPT,wss)
        // set the name in ws.username  
        ws.username = arg; 
        ws.prompt =`<USER ${arg}> `;
        ws.send(JSON.stringify({prompt:SERVER_PROMPT,msg:SERVER_SUCCESSFUL_NAME,new_username:arg}));
    }

}

// sends a message to all connected clients.
export function sendToAll(msg,prompt,wss){
    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN){
            try {
                client.send(JSON.stringify({prompt, msg}));
            } catch (error) {
                console.error('Error sending message to clients',error);
            }     
        }
    })
}

export function printHelp(){
    console.log('-- commands --');
    console.log('* start  // starts the server');
    console.log('* connect [-n,--name username]  // connects a client');
    console.log('-- chat commands --');
    console.log('* send <message>  // sends a message');
    console.log('* set-name <name>  // change name');
    console.log('* close  // close connection');
    console.log('---');
 }