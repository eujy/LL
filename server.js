const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

const GM = require("./GM")
const gm = new GM()

let err
function withError (obj, err) {
  return {
    success: !err,
    msg: err ? err.message : null,
    data: obj,
  }
}

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`)

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`)
  })

  gm.init()
  io.sockets.emit('init', gm)

  io.sockets.on('game start', () => {
    gm.init()
    gm.startTurn()
    if(gm.isFinished){
      io.sockets.on('game finished', gm)
    }
    io.sockets.emit('on game', gm)
  })

  io.sockets.on('select', (data) => {
    gm.endTurn(data.playedCard, data.whom, data.chosenCard)
    gm.startTurn()
    io.sockets.emit('on game', gm)
  })

})

let port = server.listen(process.env.PORT || 3000);
// server.listen(port) // Heroku用？よくわからん。
console.log(`running on port: ${port}`)
