import WebSocket from 'ws';
import inquirer from 'inquirer';


export const connectToServer = () => {

   const ws = new WebSocket('ws://localhost:8080');

   //the 'open' event is called when the connection is established
   ws.on('open', () => {
      console.log('Connecting to the server...');
      showMenu(ws);
   })

}

function showMenu(ws) {
   inquirer
   .prompt([
      {
         type: 'list',
         message: '-- Chat options --',
         name: 'action',
         choices: ['Send a message','Close connection'] 
      }
   ])
   .then((answers) => {
      if(answers.action === 'Send a message'){
         askAQuestion(ws);
      }else if(answers.action === 'Close connection'){
         ws.close();
         console.log('Closing connection');
      }
   })
   .catch((error) => console.error('Error selecting option:',error));
}

function askAQuestion(ws){
   inquirer
   .prompt([
      {
         type: 'message',
         message: '-- Enter your message --',
         name: 'message'
      }
   ])
   .then((answers) => {
      ws.send(answers.message);
      showMenu(ws);
   })
   .catch((error) => console.error('Error messaging:',error));
}

