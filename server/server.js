
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const COLORS = ['green', 'blue', 'orange', 'purple', 'red'];
let clients = new Map();

function broadcastGameState() {
  const players = Array.from(clients.entries()).map(([id, p]) => ({
    id,
    x: p.x,
    y: p.y,
    color: p.color,
    hp: p.hp
  }));
  const message = JSON.stringify({ type: 'state', players });

  for (const [, client] of clients) {
    client.socket.send(message);
  }
}

server.on('connection', (socket, req) => {
  const clientKey = req.socket.remoteAddress + ":" + req.socket.remotePort;
  // Remove any existing connection from same client
  for (const [id, player] of clients) {
    if (player.clientKey === clientKey) {
      clients.delete(id);
      try { player.socket.terminate(); } catch {}
    }
  }

  const id = Date.now().toString() + Math.random().toString();
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const player = {
    socket,
    x: 100 + Math.random() * 400,
    y: 100 + Math.random() * 400,
    color,
    hp: 100,
    clientKey
  };
  clients.set(id, player);

  socket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'move') {
        player.x = data.x;
        player.y = data.y;
      } else if (data.type === 'attack') {
        for (const [otherId, other] of clients) {
          if (otherId !== id && other.hp > 0) {
            const dx = other.x - data.x;
            const dy = other.y - data.y;
            if (Math.hypot(dx, dy) < 20) {
              other.hp -= 10;
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to process message:", msg);
    }
  });

  socket.on('close', () => {
    clients.delete(id);
  });
});

setInterval(broadcastGameState, 1000 / 30);
console.log("Frog Fighter server running on ws://localhost:8080");
