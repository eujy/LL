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

  io.sockets.emit('msg', 'ready?')
  let phase = 0;// 0->init, 1->draw, 2->choose, 3->to whom, 4->which card, 5->end, 6->finish
  let tempCard = null
  socket.on('message', (msg) => {
    if(phase === 0 && msg === "y"){ // init game
        gm.init()
        let players = gm.players
        for(let i in players){
          let cards = players[i].holdCard
          io.sockets.emit('msg', `player${i} has ${cards.length} cards`)
          for(let j in cards){
            let n = j+1
            io.sockets.emit('msg', `${n}: ${cards[j].name}`)
          }
        }
      phase = 1
      io.sockets.emit('msg', `player${gm.playingPlayer}'s turn`)
      io.sockets.emit('msg', 'draw a card?')
      return
    }
    if(phase === 1 && msg === "y"){ // draw phase
        gm.startTurn()
        let players = gm.players
        for(let i in players){
          let cards = players[i].holdCard
          io.sockets.emit('msg', `player${i} has ${cards.length} cards`)
          for(let j in cards){
            io.sockets.emit('msg', `${j.int + 1}: ${cards[j].name}`)
          }
        }
      phase = 2
      io.sockets.emit('msg', 'which do you play? 1or2')
      return
    }
    if(phase === 2){ // choose phase
      if(msg === "1"){
        tempCard = gm.choose(gm.playingPlayer, 0)
      } else if (msg === "2"){
        tempCard = gm.choose(gm.playingPlayer, 1)
      }
      io.sockets.emit('msg', `play ${tempCard}`)
      let players = gm.players
      let ps = ''
      switch(tempCard){
        case "Heisi":
        case "Doke":
        case "Kishi":
        case "Shogun":
          phase = 3
          for(let i in players){
            if(i === gm.playingPlayer){
              continue
            }
            ps += `${i} `
          }
          io.sockets.emit('msg', `to whom? ${ps}`)
          break
        case "Majutusi":
          phase = 3
          for(let i in players){
            ps += `${i} `
          }
          io.sockets.emit('msg', `to whom? ${ps}`)
          break
        default:
          phase = 5
          gm.endTurn(tempCard, null, null)
          //TODO ターン終了処理？

      }
      return
    }
    let tempToWhom
    if(phase === 3){ // ask to whom phase
      if(tempCard !== "Majutusi"){
        if(msg === gm.playingPlayer){
          return
        }
      }
      for(let i in gm.players){
        if(msg === i){
          tempToWhom = i
          if(tempCard === "Heisi"){
            phase = 4
            io.sockets.emit('msg', `which card?`)
            return
          }
          phase = 5
          gm.endTurn(tempCard, tempToWhom, null)
          //TODO ターン終了処理？
        }
      }
    }

    if(phase === 4){ // ask which card (for Heisi) phase
      if(msg === 3){
        
      }
    }
    //TODO ゲーム終了処理

  })

  socket.on('startTurn', () => {
    io.sockets.emit('msg', 'startTurn')
    gm.startTurn()
    let players = gm.players
    for(let i in players){
      for(let j in players[i].holdCard){
        io.sockets.emit('msg', 'player' + i + ': ' + players[i].holdCard[j].name)
      }
    }
  })

  socket.on('distribute', () => {
    gm.distribute(null)
    let p = gm.playingPlayer
    console.log('p: ', p)
    io.sockets.emit('msg', 'player' + p + ': ' + gm.players[p].holdCard[1].name)
  })

  socket.on('choose', (num) => {
    let card = gm.choose(gm.playingPlayer, num)
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
