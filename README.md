
# 🐸 Frog Fighter - Multiplayer WebSocket Game Server

This is the backend server for **Frog Fighter**, a multiplayer browser-based game built using WebSockets.

## 🚀 Features

- Multiplayer frog combat with real-time updates
- WebSocket-based Node.js backend
- Docker-ready container
- Lightweight and LAN/internet deployable

## 📦 Setup

### 🔧 Local (Node.js)

```bash
npm install
node server.js
```

### 🐳 Docker

```bash
./start.sh
```

This will:
- Build the Docker image
- Run the container on port `8080`

## 🌐 Connecting Clients

Have clients connect via:

```
ws://your-server-ip:8080
```

## 📂 Structure

- `server.js` - Game server logic
- `package.json` - Dependencies
- `Dockerfile` - For containerization
- `start.sh` - Quick start script

---

## 📄 License

MIT License
