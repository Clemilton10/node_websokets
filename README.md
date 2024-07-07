# Instalação

| [Home](./README.md) | [Vs Code](./002_vs-code.md) | [Comandos Git](./004_git.md) | [Extensões Chrome](./003_extensoes_chrome.md) |

### Instalador do Node

[https://nodejs.org/en/download/prebuilt-installer](https://nodejs.org/en/download/prebuilt-installer)

```sh
node -v
npm -v
```

### Instalando o yarn

```sh
npm install -g yarn
```

### Instalando pacotes Globais

```sh
# yarn global add nodemon # esse não deu certo
npm install -g nodemon --save-dev
```

-   Crie uma pasta
-   Entre nela e crie um arquivo `package.json` ou digite `npm init`

```json
{
	"name": "websocket",
	"version": "1.0.0",
	"description": "",
	"main": "ws.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"author": "",
	"license": "ISC",
	"dependencies": {
		"express": "^4.16.2",
		"ws": "^8.18.0"
	}
}
```

```sh
yarn
```

### ws.js

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];
let ids = [];

wss.on('connection', function connection(ws) {
	clients.push(ws);
	ids.push('');

	ws.on('message', (message) => {
		const msg = message.toString('utf8');
		const p = msg.split('|');
		const name = p[0];
		const dest = p[1];
		clients.forEach((client, i) => {
			if (ws === client && dest === '---') {
				ids[i] = name;
				clients.forEach((clientb) => {
					clientb.send('||' + JSON.stringify(ids));
				});
				return;
			}
			if (ws === client || dest === ids[i]) {
				if (client.readyState === WebSocket.OPEN) {
					clients[i].send(msg);
				}
			}
		});
	});

	ws.on('close', () => {
		let tmp_clients = [];
		let tmp_ids = [];
		clients.forEach((client, i) => {
			if (client !== ws) {
				tmp_clients.push(client);
				tmp_ids.push(ids[i]);
			}
		});
		clients = tmp_clients;
		ids = tmp_ids;
		clients.forEach((clientb) => {
			clientb.send('||' + JSON.stringify(ids));
		});
	});
});
```

### ws.html

```html
<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>WebSocket Chat</title>
		<style>
			#messages {
				list-style-type: none;
				margin: 0;
				padding: 0;
			}
			#messages li {
				padding: 8px 12px;
				margin-bottom: 3px;
				background-color: #f1f1f1;
				border-radius: 5px;
			}
			input[type='text'],
			button {
				padding: 10px;
				font-size: 16px;
				border: none;
				border-radius: 5px;
				outline: none;
				border: 1px solid #00000011;
			}
			button {
				background-color: #4caf50;
				color: white;
				cursor: pointer;
			}
			.l {
				text-align: left;
			}
			.r {
				text-align: right;
			}
		</style>
	</head>
	<body>
		<ul id="users"></ul>
		<ul id="messages"></ul>
		<input type="text" id="name" placeholder="Nome" />
		<input type="text" id="destiny" placeholder="Destino" />
		<input type="text" id="message" placeholder="Mensagem" />
		<button id="sendBtn">Send</button>
		<button id="connectBtn">Connect</button>

		<script>
			const users = document.getElementById('users');
			const messages = document.getElementById('messages');
			const messageInput = document.getElementById('message');
			const nameInput = document.getElementById('name');
			const destinyInput = document.getElementById('destiny');
			const sendButton = document.getElementById('sendBtn');
			const connectButton = document.getElementById('connectBtn');
			let socket;

			const ws = () => {
				socket = new WebSocket('ws://localhost:8080');

				socket.addEventListener('message', (event) => {
					let message = event.data;
					if (message.indexOf('||') > -1) {
						message = message.replace('||', '');
						const j = JSON.parse(message);
						users.innerHTML = '';
						j.forEach((n) => {
							if (n !== nameInput.value) {
								const dv = document.createElement('div');
								dv.style.cursor = 'pointer';
								dv.style.display = 'inline-block';
								dv.style.marginRight = '10px';
								dv.innerHTML = n;
								dv.addEventListener('click', (e) => {
									destinyInput.value = e.target.innerHTML;
								});
								users.appendChild(dv);
							}
						});
					} else {
						if (message.indexOf('|') > -1) {
							const p = message.split('|');
							const origem = p[0];
							const destiny = p[1];
							const msg = p[2];
							const dv = document.createElement('div');
							if (origem == nameInput.value) {
								dv.classList.add('r');
								dv.textContent = `${msg}`;
							} else {
								dv.classList.add('l');
								dv.textContent = `${origem}: ${msg}`;
							}
							messages.appendChild(dv);
						}
					}
				});
				socket.addEventListener('open', (event) => {
					const name = nameInput.value;
					socket.send(name + '|---|---');
					destinyInput.style.display = 'inline';
					sendButton.style.display = 'inline';
					messageInput.style.display = 'inline';
					connectButton.style.display = 'none';
				});
				sendButton.addEventListener('click', () => {
					const message = messageInput.value;
					const name = nameInput.value;
					const destiny = destinyInput.value;
					socket.send(name + '|' + destiny + '|' + message);
					messageInput.value = '';
				});
			};
			connectButton.addEventListener('click', ws);
			const init = () => {
				try {
					destinyInput.style.display = 'none';
					sendButton.style.display = 'none';
					messageInput.style.display = 'none';
				} catch (er) {
					console.error(er);
				}
			};
			window.addEventListener('load', init);
		</script>
	</body>
</html>
```

| [Home](./README.md) | [Vs Code](./002_vs-code.md) | [Comandos Git](./004_git.md) | [Extensões Chrome](./003_extensoes_chrome.md) |
