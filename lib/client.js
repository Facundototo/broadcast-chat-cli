import WebSocket from 'ws';


export const connectToServer = () => {

   const ws = new WebSocket('ws://localhost:8080');

   //the 'open' event is called when the connection is established
   ws.on('open', () => {
      console.log('Connected!');

   })

   ws.on('message', (message) => {
 
      console.log(message.toString());

      if(message.toString() === "Server: shutting down"){
         ws.close();
      } 
      
   });

}



