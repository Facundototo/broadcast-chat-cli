export const {
    CLIENT_PROMPT = '-> ',
    CLIENT_CLOSED = '\n--- client closed ---',
    CLIENT_CONNECTED = '\n--- connected to the chat ---',

    SERVER_PROMPT = '[SERVER] ',
    SERVER_NAME_ALERT = 'You do not have a username, type "help"',
    SERVER_SHUTTING_DOWN = '** server shutting down **',
    SERVER_CLIENT_DISCONNECTED = 'client disconnected',
    SERVER_CLIENT_CONNECTED = 'client connected',
    SERVER_SUCCESSFUL_NAME = 'name setted successfully',
    SERVER_NO_SUCCESSFUL_NAME = 'a client already has that name or it is not valid',
    SERVER_PRIVATE_MESSAGE_ERROR = 'the user you want to send a private message does not exist',
    
    HELP_ADVICE = 'check the "/help" command to use the chat correctly',

    SET_NAME_COMMAND = '/set-name',
    SEND_COMMAND = '/send',
    SEND_TO_COMMAND = '/send-to',
    HELP_COMMAND = '/help',
    CLOSE_COMMAND = '/close',
    CLEAR_COMMAND = '/clear'

} = process.env