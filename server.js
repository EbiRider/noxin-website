const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3000', 10)
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  io.on('connection', (socket) => {
    socket.on('join-task', (taskId) => {
      socket.join(`task:${taskId}`)
      socket.data.taskId = taskId
    })

    socket.on('leave-task', (taskId) => {
      socket.leave(`task:${taskId}`)
      stopTyping(socket)
    })

    socket.on('join-user', (username) => {
      socket.join(`user:${username}`)
      socket.data.username = username
    })

    socket.on('typing', ({ taskId, username, name }) => {
      socket.data.username = username
      socket.data.typingTask = taskId
      socket.data.typingName = name
      socket.to(`task:${taskId}`).emit('typing', { username, name })
    })

    socket.on('stop-typing', ({ taskId, username }) => {
      socket.data.typingTask = null
      socket.to(`task:${taskId}`).emit('stop-typing', { username })
    })

    socket.on('disconnect', () => {
      stopTyping(socket)
    })

    function stopTyping(s) {
      const { typingTask, username } = s.data
      if (typingTask && username) {
        s.to(`task:${typingTask}`).emit('stop-typing', { username })
        s.data.typingTask = null
      }
    }
  })

  global._io = io

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
