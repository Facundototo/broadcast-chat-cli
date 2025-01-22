import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { SERVER_CLIENT_CONNECTED, SERVER_CLIENT_DISCONNECTED, SERVER_NAME_ALERT, SERVER_NO_SUCCESSFUL_NAME, SERVER_PROMPT, SERVER_SHUTTING_DOWN, SERVER_SUCCESSFUL_NAME } from '../utils/utils.js';

const PORT = 8080;

export const startServer = () => {

    // noServer means that you have to manually create an http server. If you don't want to, just set {port:...} and wss will manage the http server for you
    const wss = new WebSocketServer({noServer:true,clientTracking:true});

    wss.on('connection',(ws) => {

        console.log(SERVER_CLIENT_CONNECTED);
        
        // waits for the 'set-name' option
        setTimeout(() =>{
            // sends a message to all the clients that someone has connected. If the connected client already a user name, it will be displayed in the message
            sendToAll(`${SERVER_CLIENT_CONNECTED} ${(ws.username !== undefined)?`-> *${ws.username}*`:``}`,SERVER_PROMPT,wss);
        },500)

        ws.on('error', console.error);

        ws.on('message', (message) => manageMsg(message,wss,ws));

        // if username isn't undefined, then send to all the clients that he has left
        ws.on('close', () => {
                console.log(SERVER_CLIENT_DISCONNECTED);
                (ws.username !== undefined) && sendToAll(`${SERVER_CLIENT_DISCONNECTED}: ${ws.username}`,SERVER_PROMPT,wss)
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
    sendToAll(SERVER_SHUTTING_DOWN,SERVER_PROMPT,wss);

    wss.close(() => {
        console.log('server closed');
        process.exit(0);
    });
}

// sends a message to all connected clients.
function sendToAll(msg,prompt,wss){
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

// manages the data sent by clients
function manageMsg(message,wss,ws){
    const { option,arg } = JSON.parse(message);
        
    if(option === 'send-to-all'){
        if(ws.username === undefined) ws.send(JSON.stringify({prompt:SERVER_PROMPT,msg:SERVER_NAME_ALERT}));
        else sendToAll(arg,ws.prompt,wss);
    } 
    else if(option === 'set-name') {

        // if enters here, it means that there is no client with that username
        if(!validateUsernames(arg,wss)){
            //sent to all that a client has changed his name
            if(ws.username) sendToAll(`user "${ws.username}" changed his name to "${arg}"`,SERVER_PROMPT,wss)
            // set the name in ws.username  
            ws.username = arg; 
            ws.prompt =`<USER ${arg}> `;
            ws.send(JSON.stringify({prompt:SERVER_PROMPT,msg:SERVER_SUCCESSFUL_NAME,new_username:arg}));
        }else{
            ws.send(JSON.stringify({prompt:SERVER_PROMPT,msg:SERVER_NO_SUCCESSFUL_NAME}));
        }
    }
}

function validateUsernames(username,wss){
    // returns undefined or the client with the same username
    // wss is a Set, not an array
    for (const client of wss.clients) {
        if (client.username === username)  return client;
    }
    // if the username is blank
    return (username.trim().length !== 0)?undefined:true;
}

