#!/usr/bin/env node

const { connectToServer } = require('../lib/client.js');
const { startServer } = require('../lib/server.js');


const args = process.argv.slice(2);

switch(args[0]){
    case 'start':
        startServer();
        break;
    case 'connect':
        connectToServer();
        break;
}