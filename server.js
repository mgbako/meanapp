const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', socket => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports.server = server;