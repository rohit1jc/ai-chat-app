require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const apiRoutes = require('./src/routes/api');
const ChatSocket = require('./src/sockets/ChatSocket');

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*', // For demo purposes, allow all origins
        methods: ['GET', 'POST']
      }
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSockets();
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  initializeRoutes() {
    this.app.use('/api', apiRoutes);
    this.app.get('/', (req, res) => {
      res.send('API is running');
    });
  }

  initializeSockets() {
    const chatSocket = new ChatSocket(this.io);
    chatSocket.initialize();
  }

  listen() {
    const port = process.env.PORT || 5000;
    this.server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

const appInstance = new App();
appInstance.listen();
