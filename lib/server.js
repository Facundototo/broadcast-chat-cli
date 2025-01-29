import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { JOIN_CHANNEL_COMMAND, SEND_COMMAND, SEND_TO_COMMAND, SERVER_CLIENT_CONNECTED, SERVER_CLIENT_DISCONNECTED, SERVER_NAME_ALERT, SERVER_PROMPT, SERVER_SHUTTING_DOWN, SET_NAME_COMMAND } from '../utils/utils.js';
import { setName,sendToAll, sendPrivateMessage, joinChannel } from './commands/commands.js';

const PORT = 8080;
const channels = ["#general","#gaming"];

export const startServer = () => {

    // noServer means that you have to manually create an http server. If you don't want to, just set {port:...} and wss will manage the http server for you
    const wss = new WebSocketServer({noServer:true,clientTracking:true});

    wss.on('connection',(ws) => {

        console.log(SERVER_CLIENT_CONNECTED);
        
        // waits for the 'set-name' option
        setTimeout(() =>{
            // sends a message to all the clients that someone has connected. If the connected client already a user name, it will be displayed in the message
            sendToAll(`${SERVER_CLIENT_CONNECTED} ${(ws.username !== undefined)?`-> *${ws.username}*`:``}`,SERVER_PROMPT,ws.channel,wss);
        },500)

        ws.on('error', console.error);

        ws.on('message', (message) => manageMsg(message,wss,ws));

        // if username isn't undefined, then send to all the clients that he has left
        ws.on('close', () => {
                console.log(SERVER_CLIENT_DISCONNECTED);
                (ws.username !== undefined) && sendToAll(`${SERVER_CLIENT_DISCONNECTED}: ${ws.username}`,SERVER_PROMPT,ws.channel,wss)
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
    sendToAll(SERVER_SHUTTING_DOWN,SERVER_PROMPT,undefined,wss);

    wss.close(() => {
        console.log('server closed');
        process.exit(0);
    });
}

// manages the data sent by clients
function manageMsg(message,wss,ws){

    const { option,arg } = JSON.parse(message);

    // checks if the user who wants to send a message has a username, if not -> alert
    if((option === SEND_COMMAND || option === SEND_TO_COMMAND || option === JOIN_CHANNEL_COMMAND) && ws.username === undefined){
        ws.send(JSON.stringify({prompt:SERVER_PROMPT,msg:SERVER_NAME_ALERT}));
    }else{  
        switch(option){
            case SEND_COMMAND: sendToAll(arg,ws.prompt,ws.channel,wss);
                break;
            case SEND_TO_COMMAND: sendPrivateMessage(arg,ws,wss);
                break;
            case SET_NAME_COMMAND: setName(arg,wss,ws);
                break;
            case JOIN_CHANNEL_COMMAND: joinChannel(arg,ws,channels);
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

