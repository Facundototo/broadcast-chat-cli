export const {
    SERVER_PROMPT = '[SERVER] ',
    CLIENT_PROMPT = '-> ',
    SERVER_NAME_ALERT = 'You do not have a username, type "help"',
    SERVER_SHUTTING_DOWN = '** server shutting down **',
    SERVER_CLIENT_DISCONNECTED = 'client disconnected',
    SERVER_CLIENT_CONNECTED = 'client connected',
    SERVER_SUCCESSFUL_NAME = 'name setted successfully',
    SERVER_NO_SUCCESSFUL_NAME = 'a client already has that name or it is not valid',
    CLIENT_CLOSED = '\n--- client closed ---',
    CLIENT_CONNECTED = '\n--- connected to the chat ---',
    HELP_ADVICE = 'check the "help" command to use the chat correctly'
} = process.env

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