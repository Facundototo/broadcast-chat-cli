import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { Server,Command } from '../../utils/messages.js';
import { setName,sendToAll, sendPrivateMessage, joinChannel, returnClientsByChannel } from '../commands/commands.js';
import { sendTo } from '../../utils/utils.js';

const PORT = 8080;

export const startServer = () => {

    // noServer means that you have to manually create an http server. If you don't want to, just set {port:...} and wss will manage the http server for you
    const wss = new WebSocketServer({noServer:true,clientTracking:true});

    wss.on('connection',(ws) => {

        console.log(Server.CLIENT_CONNECTED);
        ws.channel = '#general';
        
        // waits for the 'set-name' option
        setTimeout(() =>{
            // sends a message to all the clients that someone has connected. If the connected client already a user name, it will be displayed in the message
            sendToAll(`${Server.CLIENT_CONNECTED} ${(ws.username !== undefined)?`-> *${ws.username}*`:``}`,Server.PROMPT,ws.channel,wss);
        },500)

        ws.on('error', console.error);

        ws.on('message', (message) => manageMsg(message,wss,ws));

        // if username isn't undefined, then send to all the clients that he has left
        ws.on('close', () => {
                console.log(Server.CLIENT_DISCONNECTED);
                (ws.username !== undefined) && sendToAll(`${Server.CLIENT_DISCONNECTED}: ${ws.username}`,Server.PROMPT,ws.channel,wss)
            }
        );
            
    })

    // the 'SIGINT' event is emitted whenever the input stream receives a Ctrl+C input
    process.on('SIGINT', () => closeServer(wss))

    createServer()
    // listening
    .listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })
    // listens to the event 'upgrade' if a client wants to upgrade to a websocket protocol
    .on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            //call to the 'connection' event
            wss.emit('connection', ws, req);
          });
    })

}

// closes the server
function closeServer(wss) {

    console.log('closing server');

    // sends each client a message to disconnect from the server
    sendToAll(Server.SHUTTING_DOWN,Server.PROMPT,undefined,wss);

    wss.close(() => {
        console.log('server closed');
        process.exit(0);
    });
}

// manages the data sent by clients
function manageMsg(message,wss,ws){

    const { option,arg } = JSON.parse(message);

    // checks if the user who wants to send a message has a username, if not -> alert
    if((option === Command.SEND || option === Command.SEND_TO|| option === Command.JOIN_CHANNEL) && ws.username === undefined){
        sendTo(ws,{prompt:Server.PROMPT,msg:Server.NAME_ALERT,show_msg:true});
    }else{  
        switch(option){
            case Command.SEND: sendToAll(arg,ws.prompt,ws.channel,wss);
                break;
            case Command.SEND_TO: sendPrivateMessage(arg,ws,wss);
                break;
            case Command.SET_NAME: setName(arg,wss,ws);
                break;
            case Command.JOIN_CHANNEL: joinChannel(arg,ws);
                break;   
            case Command.LIST_USERS: returnClientsByChannel(wss,ws,arg);
                break;
        }
    }
}

export function validateUsernames(username,wss){
    // returns undefined or the client with the same username
    // wss.clients is a Set, not an array
    for (const client of wss.clients) {
        if (client.username === username) return client;
    }
    return undefined;
}

