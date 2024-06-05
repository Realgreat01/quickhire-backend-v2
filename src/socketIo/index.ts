import http from 'http';
// import { VERIFY_TOKEN } from '../config';
import { Server, Socket } from 'socket.io';
// import {} from // ADD_NEW_CONNECTED_USER,
// INCREASE_USER_VISA_TOKENS,
// REMOVE_DISCONNECTED_USER,
// SEND_SOCKET_GROUP_MESSAGE,
// SEND_SOCKET_PRIVATE_MESSAGE,
// '../controllers/socket.io';

function initSocketServer(server: http.Server): Server {
  const io = new Server(server, {
    cors: {
      origin: ['https://admin.socket.io', '*'],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      // socket.user = VERIFY_TOKEN(token);
      next();
    } else {
      next(new Error('User not authenticated'));
    }
  });

  io.on('connection', (socket: Socket) => {
    // const CONNECTED_USER = ADD_NEW_CONNECTED_USER(socket);
    // socket.on('CONNECT_NEW_USER', CONNECTED_USER);

    // const DISCONNECTED_USER = REMOVE_DISCONNECTED_USER(socket);
    // socket.on('DISCONNECT_USER', DISCONNECTED_USER);

    // const PRIVATE_MESSAGE = SEND_SOCKET_PRIVATE_MESSAGE(socket);
    // socket.on('SEND_PRIVATE_MESSAGE', PRIVATE_MESSAGE);

    // const GROUP_MESSAGE = SEND_SOCKET_GROUP_MESSAGE(socket);
    // socket.on('SEND_COMMUNITY_MESSAGE', GROUP_MESSAGE);

    // const CONNECTION_TIME = INCREASE_USER_VISA_TOKENS(socket, new Date());

    socket.on('disconnect', () => {
      // CONNECTION_TIME(new Date());
      // socket.on('DISCONNECT_USER', DISCONNECTED_USER);
    });
  });

  return io;
}

export { initSocketServer };
