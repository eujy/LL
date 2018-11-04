const socket = io('http://localhost:3000');

let isFinished = true
let gm = null
let pp = null
let clickPhase = "first"
let tempCardIdx = null
let tempCardName = null
let tempWhom = null

let you = new Vue({ 
  el: '#you',
  data: {
      playerNum: '-'
  }
});

let message = new Vue({ 
  el: '#message',
  data: {
      message: 'default message'
  }
});

let yama = new Vue({ 
  el: '#yama',
  data: {
      cards: 'default yama'
  }
});

let myHold = new Vue({
  el: '#myHold',
  data: {
    cards: "default holdCards"
  }
})

let myTrsh = new Vue({
  el: '#myTrsh',
  data: {
    cards: "default trushCards"
  }
})

let tekiTrsh = new Vue({ // TODO 汎用的にする
  el: '#tekiTrsh',
  data: {
    cards: "default trushCards"
  }
})

let buttonField = new Vue({
  el: '#buttonField',
  data: {
    value1: "Start",
    value2: "Start",
  },
  methods: {
    click1: function(event){
      clicks(1)
    },
    click2: function(event){

    },
  }
})

function clicks(num){
  if(isFinished){
    socket.emit('game start', null)
    return
  }
  if(clickPhase === "first"){ //SELECT A CARD
    let card = gm.players[pp].holdCard[num].name
    for(let cardInfo of gm.cardsInfo){
      if(cardInfo.action !== null && card === cardInfo.card.name){
        tempCardIdx = num
        tempCardName = card
        clickPhase = "second"
        message.message = "to whom?(f)"
        return
      }
    }
    socket.emit('select', {playedCardIdx: num, playedCard: card, whom: null, chosenCard: null})
    message.message = "select a card(f)"
    return
  }
  if(clickPhase === "second"){ //TO WHOM
    if(tempCardName === "Heisi"){ //WARN 兵士以外も出てきた場合は修正
      tempWhom = num
      clickPhase = "third"
      message.message = "which card?(s)"
      return
    }
    socket.emit('select', {playedCardIdx: tempCardIdx, playedCard: tempCardName, whom: num, chosenCard: null})
    resetTemp()
    message.message = "select a card(s)"
    return
  }
  if(clickPhase === "third"){ //WHICH CARD
    socket.emit('select', {playedCardIdx: tempCardIdx, playedCard: tempCardName, whom: tempWhom, chosenCard: gm.cardList[num]})
    resetTemp()
    message.message = "select a card(t)"
  }
}

function resetTemp(){
  tempCardIdx = null
  tempCardName = null
  tempWhom = null
  clickPhase = "first"
}

socket.on('on game', (data) => {
  isFinished = false
  receiveData(data)
  display()
  message.message = "select a card(og)"
})

socket.on('game finished', (data) => {
  isFinished = true
  receiveData(data)
  display()
  message.message = "new game?"
})

function receiveData(data){
  gm = data
  pp = gm.playingPlayer
  // isFinished = gm.isFinished
}


function display(){
  dispName()
  dispYama()
  dispMine()
  dispOtherTrsh()

  function dispName(){
    you.playerNum = pp
  }
  function dispYama(){
    yama.cards = `${gm.yama.length} cards`
  }
  function dispMine(){
    let pp = gm.playingPlayer
    let msg = ''
    for(let card of gm.players[pp].holdCard){
      msg += card.name
    }
    myHold.cards = msg
    msg = ''
    for(let card of gm.players[pp].trshCard){
      msg += card.name
    }
    myTrsh.cards = msg
  }
  function dispOtherTrsh(){
    let pp = gm.playingPlayer
    for(let player of gm.players){
      if(player.name === gm.players[pp].name){
        continue
      }
      let msg = ''
      for(let card of player.trshCard){
        msg += card.name
      }
      tekiTrsh.cards = msg //TODO 汎用的にする。
    }
  }
}
