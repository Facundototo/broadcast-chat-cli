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