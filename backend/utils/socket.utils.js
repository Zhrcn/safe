let io = null;

const setIO = (socketIO) => {
  io = socketIO;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Make sure to call setIO() first.');
  }
  return io;
};

module.exports = {
  setIO,
  getIO
}; 