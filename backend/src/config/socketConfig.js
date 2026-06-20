const { Server } = require("socket.io");
const http = require("http");
const securityUtil = require("../utils/securityUtil");
const messageService = require("../services/messageService");

const userMap = new Map();
let io;

const configureApp = (app) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: process.env.FE_URL,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      tokenData = securityUtil.verifyToken(token);
      socket.userId = tokenData.id;
      socket.role = tokenData.role;
      next();
    } catch (ex) {
      next(ex);
    }
  });

  io.on("connection", async (socket) => {
    userMap.set(socket.userId, socket.id);

    socket.on("disconnect", (rea) => {
      userMap.delete(socket.userId, socket.id);
      console.log(rea);
    });

    socket.on("connect_error", (error) => {
      console.log(error);
    });

    socket.on("client_send_messages_request", async (employeeId) => {
      try {
        const messages = await messageService.getMessages(employeeId);
        socket.emit("server_send_messages", messages);
      } catch (ex) {
        console.log(ex);
      }
    });

    socket.on("client_send_message", async (message) => {
      try {
        await messageService.createMessage(message);
        const employeeSocketId = userMap.get(message.employeeId);
        const managerSocketId = userMap.get(message.managerId);

        io.to(employeeSocketId).emit("server_send_message", message);
        io.to(managerSocketId).emit("server_send_message", message);
      } catch (ex) {
        console.log(ex);
      }
    });

    const chatGroups = await messageService.getChatGroups(
      socket.userId,
      socket.role,
    );

    socket.emit("server_send_groups", chatGroups);
  });

  return server;
};

const getIo = () => {
  return io;
};

module.exports = { configureApp, userMap, getIo };
