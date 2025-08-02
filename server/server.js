const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const COLORS = ['green', 'blue', 'orange', 'purple', 'red'];
const TICK_RATE = 1000 / 30; // 30 FPS
const ATTACK_RADIUS = 20;

const clients = new Map();

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomPosition() {
  return {
    x: 100 + Math.random() * 400,
    y: 100 + Math.random() * 400,
  };
}

function broadcastGameState() {
  const players = Array.from(clients.entries()).map(([id, p]) => ({
    id,
    x: p.x,
    y: p.y,
    color: p.color,
    hp: p.hp
  }));

  const message = JSON.stringify({ type: 'state', players });

  for (const [, player] of clients) {
    if (player.socket.readyState === WebSocket.OPEN) {
      player.socket.send(message);
    }
  }
}

server.on('connection', (socket, req) => {
  const clientKey = `${req.socket.remoteAddress}:${req.socket.remotePort}`;

  // Remove any existing client with the same IP+port
  for (const [id, player] of clients) {
    if (player.clientKey === clientKey) {
      try {
        player.socket.terminate();
      } catch (err) {
        console.warn(`Failed to terminate existing socket for ${clientKey}`);
      }
      clients.delete(id);
    }
  }

  const id = `${Date.now()}-${Math.random()}`;
  const { x, y } = getRandomPosition();
  const color = getRandomColor();

  const player = {
    socket,
    x,
    y,
    color,
    hp: 100,
    clientKey,
  };

  clients.set(id, player);
  console.log(`Player connected: ${id} (${clientKey})`);

  socket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (!data || !data.type) return;

      switch (data.type) {
        case 'move':
          player.x = data.x;
          player.y = data.y;
          break;

        case 'attack':
          for (const [otherId, other] of clients) {
            if (otherId !== id && other.hp > 0) {
              const dx = other.x - data.x;
              const dy = other.y - data.y;
              if (Math.hypot(dx, dy) < ATTACK_RADIUS) {
                other.hp -= 10;
                if (other.hp < 0) other.hp = 0;
              }
            }
          }
          break;
      }

    } catch (err) {
      console.error("Error processing message:", err.stack || err);
    }
  });

  socket.on('close', () => {
    clients.delete(id);
    console.log(`Player disconnected: ${id}`);
  });
});

setInterval(broadcastGameState, TICK_RATE);
console.log("✅ Frog Fighter server running on ws://localhost:8080");
