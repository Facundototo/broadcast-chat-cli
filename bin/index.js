#!/usr/bin/env node

import { connectToServer } from '../lib/client/client.js';
import { printHelp } from '../lib/commands/commands.js';
import { startServer } from '../lib/server/server.js';

const args = process.argv.slice(2);

const defaultPort = 8080;

const name = checkNameOption(args.slice(1));
const port = checkPortOption(args.slice(1));

switch(args[0]){
    // brochat-cli start [-p,--port port]
    case 'start':
        startServer(port);
        break;
    // brochat-cli connect [-n,--name name] [-p,--port port]
    case 'connect':
        connectToServer(name,port);
        break;
    // brochat-cli help 
    case 'help':    
    default:
        printHelp();
        break;
}

// checks -p/--port option
function checkPortOption(args){

    const indexPortOption = args.findIndex(arg => arg === '-p' || arg === '--port');

    if(indexPortOption !== -1) {
        // if the index of the arg element following the option is an integer the port is valid 
        const isPortValid = Number.isInteger(Number(args[indexPortOption+1]));
        return isPortValid ? args[indexPortOption+1] : defaultPort;
    }else return defaultPort;
}

// checks -n/--name option
function checkNameOption(args){
    const indexNameOption = args.findIndex(arg => arg === '-n' || arg === '--name');
    // the client validates if the name is correct later
    return indexNameOption !== -1 ? args[indexNameOption+1] : undefined;
}