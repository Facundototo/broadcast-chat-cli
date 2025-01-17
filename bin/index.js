#!/usr/bin/env node

import { connectToServer } from '../lib/client.js';
import { startServer } from '../lib/server.js';

const args = process.argv.slice(2);

switch(args[0]){
    case 'start':
        startServer();
        break;
    case 'connect':
        connectToServer();
        break;
}