#!/usr/bin/env node

import { connectToServer } from '../lib/client.js';
import { printHelp } from '../lib/commands/commands.js';
import { startServer } from '../lib/server.js';

const args = process.argv.slice(2);
const hasUsername = (args[1] === '-n' || args[1] === '--name');

switch(args[0]){
    // broadcast-chat-cli start
    case 'start':
        startServer();
        break;
    // broadcast-chat-cli connect [-n,--name] [username]
    case 'connect':
        connectToServer(hasUsername ? args[2] : undefined );
        break;
    case 'help':    
    default:
        printHelp();
        break;
}