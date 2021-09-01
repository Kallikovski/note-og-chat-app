const server = require('./app')
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  generateMessage,
} = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', async ({
    username,
    room,
    color
  }, callback) => {
    const {
      error,
      user
    } = addUser({
      id: socket.id,
      username,
      room,
      color
    });

    if (error) {
      return callback(error)
    }

    socket.join(user.room);

    const messageAdminToUser = await generateMessage('Admin', '#000000', 'Welcome!')
    const messageAdminToAllUsers = await generateMessage('Admin', '#000000', `${user.username} has joined!`)

    socket.emit('message', messageAdminToUser);
    socket.broadcast.to(user.room).emit('message', messageAdminToAllUsers);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    callback()
  });

  socket.on('sendMessage', async (message, callback) => {
    const user = getUser(socket.id)

    const filter = new Filter();

    if (filter.isProfane(message)) {
      callback('Profanity is not allowed!')
      message = '****'
    }
    
    const userMessage = await generateMessage(user.username, user.color, message)

    io.to(user.room).emit('message', userMessage);
    callback();
  });

  socket.on('disconnect', async () => {
    const user = removeUser(socket.id)

    if (user) {

      const messageAdminToAllUsers = await generateMessage('Admin', '#000000', `${user.username} has left!`)

      io.to(user.room).emit('message', messageAdminToAllUsers)
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
});
