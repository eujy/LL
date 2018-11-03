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
  let phase = 'init';// init, draw, choose, askToWhom, askWhichCard, endTurn, finishGame
  let tempCard = null
  let tempToWhom = null
  socket.on('message', (msg) => {
    if(phase === 'init' && msg === "y"){
        gm.init()
        let players = gm.players
        for(let i in players){
          let cards = players[i].holdCard
          io.sockets.emit('msg', `player${i} has ${cards.length} cards`)
          for(let j = 0; j < cards.length; j++){
            io.sockets.emit('msg', `${j + 1}: ${cards[j].name}`)
          }
        }
      phase = 'draw'
      io.sockets.emit('msg', `player${gm.playingPlayer}'s turn`)
      io.sockets.emit('msg', 'draw a card?')
      return
    }

    if(phase === 'draw' && msg === "y"){
        gm.startTurn()
        let players = gm.players
        for(let i in players){
          let cards = players[i].holdCard
          io.sockets.emit('msg', `player${i} has ${cards.length} cards`)
          for(let j = 0; j < cards.length; j++){
            io.sockets.emit('msg', `${j + 1}: ${cards[j].name}`)
          }
        }
      phase = 'choose'
      io.sockets.emit('msg', 'which do you play? 1or2')
      return
    }

    if(phase === 'choose'){
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
          phase = 'askToWhom'
          for(let i in players){
            if(i === gm.playingPlayer){ //TODOここ入ってないかも。
              continue
            }
            ps += `${i} `
          }
          io.sockets.emit('msg', `to whom? ${ps}`)
          break
        case "Majutusi":
          phase = 'askToWhom'
          for(let i in players){
            ps += `${i} `
          }
          io.sockets.emit('msg', `to whom? ${ps}`)
          break
        default:
          phase = 'endTurn'
          gm.endTurn(tempCard, null, null)
          tempCard = null
          io.sockets.emit('call display', null)
          //TODO ターン終了処理？

      }
      return
    }

    if(phase === 'askToWhom'){ // ask to whom phase
      if(tempCard !== "Majutusi"){
        if(msg === gm.playingPlayer){
          return
        }
      }
      for(let i in gm.players){
        if(msg === i){
          tempToWhom = i
          if(tempCard === "Heisi"){
            phase = 'askWhichCard'
            io.sockets.emit('msg', `which card?`)
            return
          }
          phase = 'endTurn'
          gm.endTurn(tempCard, tempToWhom, null)
          tempCard = null
          tempToWhom = null
          io.sockets.emit('call display', null)
          //TODO ターン終了処理？
        }
      }
    }

    if(phase === 'askWhichCard'){ // only for Heisi
      let chosenCard = null
      for(let i in gm.cardList){
        if(msg === i){
          chosenCard = gm.cardList[i]
          break
        }
      }
      phase = 'endTurn'
      gm.endTurn(tempCard, tempToWhom, chosenCard)
      tempCard = null
      tempToWhom = null
      chosenCard = null
      io.sockets.emit('call display', null)
    }
    //TODO ゲーム終了処理

  })

  socket.on('display', () => {
    let msg = {
      players: gm.players,
      yama: gm.yama,
    }
    io.sockets.emit('display', msg)
    console.log('display all')
    console.log(msg)
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
