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

- `start`: starts the server
- `connect [-n,--name username]`: connects a client
- `help`: all the commands

#### Chat Commands

- `/send <message>`: sends a message
- `/send-to <username> <message>`: sends a private message to a user
- `/set-name <name>`: change name
- `/close`: close connection
- `/clear`: clears the chat
- `/help`: all the commands

---

#### Version 1.1.0

- Added new feature: send private messages to a user.
- New command to clean the terminal.
- Chat commands changed, putting '/' first.

---

https://roadmap.sh/projects/broadcast-server
