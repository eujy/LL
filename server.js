const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

const gm = require("./GM")

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
