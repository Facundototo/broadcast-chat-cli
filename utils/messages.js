export const Client = {
    PROMPT: '-> ',
    CLOSED: '\n--- client closed ---',
    HELP_ADVICE: 'check the "/help" command to use the chat correctly'
} 

export const Server = {
    PROMPT: '[SERVER] ',
    NAME_ALERT: 'You do not have a username, type "help"',
    SHUTTING_DOWN: '** server shutting down **',
    CLIENT_DISCONNECTED: 'client disconnected',
    CLIENT_CONNECTED: 'client connected',
    SUCCESSFUL_NAME: 'name setted successfully',
    NO_SUCCESSFUL_NAME: 'a client already has that name or it is not valid',
    PRIVATE_MESSAGE_ERROR: 'the user you want to send a private message does not exist',
    CHANNEL_NOT_FINDED: 'the channel you are trying to join does not exist',
    CHANNEL_JOINED: 'joined to the channel',
    USERS_FILTERED_BYCHANNEL: 'users filtered by channel'
}

export const Command = {
    SET_NAME: '/set-name',
    SEND: '/send',
    SEND_TO: '/send-to',
    JOIN_CHANNEL: '/join',
    LIST_CHANNELS: '/list-channels',
    LIST_USERS: '/list-users',
    HELP: '/help',
    CLOSE: '/close',
    CLEAR: '/clear'
}

export const printChatChannel = (channel,prompt) => {
    prompt('');
    console.log(`--- connected to ${channel} channel ---`);
}