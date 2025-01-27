#!/usr/bin/env node

import { connectToServer } from '../lib/client.js';
import { printHelp } from '../lib/commands/commands.js';
import { startServer } from '../lib/server.js';

const args = process.argv.slice(2);
const hasUsername = (args[1] === '-n' || args[1] === '--name');

switch(args[0]){
    // brochat-cli start
    case 'start':
        startServer();
        break;
    // brochat-cli connect [-n,--name] [username]
    case 'connect':
        connectToServer(hasUsername ? args[2] : undefined );
        break;
    // brochat-cli help 
    case 'help':    
    default:
        printHelp();
        break;
}