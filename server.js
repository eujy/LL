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

  socket.on('start', () => {
    gm.init()
    let players = gm.players
    for(let i in players){
      console.log(players[i])
      io.sockets.emit('msg', 'player' + i + ': ' + players[i].holdCard[0].name)
    }
  })

  socket.on('distribute', () => {
    let card = gm.distribute(null)
    let p = gm.playingPlayer
    console.log('p: ', p)
    io.sockets.emit('msg', 'player' + p + ': ' + gm.players[p].holdCard[1].name)
  })

  socket.on('choose', (num) => {
    gm.choose(gm.playingPlayer, num)
    let p = gm.playingPlayer
    console.log('p: ', p)
    io.sockets.emit('msg', 'player' + p + ': choose ' + card)
  })

  socket.on('req_to_everyone', (data) => { // socketに繋がってる全員
    console.log('to_everyone', data)
    io.sockets.emit('to_everyone', data)
  })
  socket.on('req_to_self', (data) => { // 送った本人のみ
    console.log('to_self', JSON.stringify(withError(data, null)))
    io.to(socket.id).emit('to_self', JSON.stringify(withError(data, null)))
  })

})

let port = server.listen(process.env.PORT || 3000);
// server.listen(port) // Heroku用？よくわからん。
console.log(`running on port: ${port}`)
