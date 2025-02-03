# Broadcast Chat CLI

**Is a 'cli chat' where you can chat with other users (localhost). I did it without frameworks or libraries, just to practice.**

---

## Installation

```bash
npm install -g brochat-cli
```

---

## Usage

To start using my task CLI, run:

```bash
brochat-cli help
```

---

### Commands

- `start [-p,--port port]`: starts the server
- `connect [-n,--name username] [-p,--port port]`: connects a client
- `help`: all the commands

#### Chat Commands

- `/send <message>`: send a message
- `/send-to <username> <message>`: send a private message to a user
- `/set-name <name>`: change name
- `/join <channel>`: join a channel
- `/list-channels`: list of existing channels to join
- `/list-users`: list of connected users
- `/close`: close connection
- `/clear`: clear the chat
- `/help`: all the commands

---

#### Version 1.1.0

- Added new feature: send private messages to a user.
- New command to clean the terminal.
- Chat commands changed, putting '/' first.

#### Version 1.2.0

- Join other channels
- Server information commands (/list-channels, /list-users)
- The option to set a specific port when starting or connecting to a server

---

https://roadmap.sh/projects/broadcast-server
