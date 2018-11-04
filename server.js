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

  socket.on('game start', () => {
    console.log('game start')
    gm.init()
    gm.startTurn()
    if(gm.isFinished){
      io.sockets.emit('game finished', gm)
    }
    io.sockets.emit('on game', gm)
  })

  socket.on('select', (data) => {
    console.log('select', data)
    gm.endTurn(data.cardIdx, data.playedCard, data.whom, data.chosenCard)
    if(gm.isFinished){
      io.sockets.emit('game finished', gm)
    }
    gm.startTurn()
    if(gm.isFinished){
      io.sockets.emit('game finished', gm)
    }
    io.sockets.emit('on game', gm)
  })

})

let port = server.listen(process.env.PORT || 3000);
// server.listen(port) // Heroku用？よくわからん。
console.log(`running on port: ${port}`)
