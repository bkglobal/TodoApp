const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();

module.exports.createConnection = (io) => {
  // Initialize the empty array and object for user logs and connections..
  const connections = [];
  const users = {};

  io.of("/notification").on("connection", (socket) => {
    // When new user connected it will be saved on connection and users..
    connections.push(socket);

    // Every user need to join the notificaiton panel.
    socket.on("join", (user) => {
      users[socket.id] = user;

      //   Event emitters for sending notifications..
      //   #######################################
      eventEmitter.on("addTodo", (data) => {
        Object.keys(connections).forEach((conn) => {
          if (
            data.users.includes(users[conn].id) &&
            !users[conn].id === data.currUser
          ) {
            io.to(socketid).emit("addTodoNotificaiton", data.message);
          }
        });
      });

      eventEmitter.on("editTodo", (data) => {
        Object.keys(connections).forEach((conn) => {
          if (
            data.users.includes(users[conn].id) &&
            !users[conn].id === data.currUser
          ) {
            io.to(socketid).emit("editTodoNotificaiton", data.message);
          }
        });
      });

      eventEmitter.on("deleteTodo", (data) => {
        Object.keys(connections).forEach((conn) => {
          if (
            data.users.includes(users[conn].id) &&
            !users[conn].id === data.currUser
          ) {
            io.to(socketid).emit("deleteTodoNotificaiton", data.message);
          }
        });
      });

      // When user disconnect remove the entry from people object and socket array.
      io.on("disconnect", function () {
        delete users[socket.id];
        connections.splice(sockets.indexOf(socket), 1);
      });
    });
  });
};
