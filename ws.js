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
