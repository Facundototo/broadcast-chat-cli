const WebSocket = require('ws');

const connectToServer = () => {

   const ws = new WebSocket('ws://localhost:8080');

   //the 'open' event is called when the connection is established
   ws.on('open', () => {
        console.log('Connecting to the server...');
   })

}

module.exports = { connectToServer };