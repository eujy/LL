const socket = io('http://localhost:3000');
let isFinished = true
let gm = null
let pp = null

class ClientManager {
  constructor(){

  }

}

const CM = new ClientManager()

let yama = new Vue({ 
  el: '#yama',
  data: {
      message: 'default yama'
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

let p1Trsh = new Vue({ // TODO 汎用的にする
  el: '#p1Trsh',
  data: {
    cards: "default trushCards"
  }
})

let buttonField = new Vue({
  el: '#buttonField',
  data: {
    value: "Start"
  },
  methods: {
    click1: function(event){
      display()
      if(isFinished){
        socket.emit('start game', null)
        return
      }
      socket.emit('select', 1)
      this.value = gm.players[]
    },
    click2: function(event){
      display()
      if(isFinished){
        socket.emit('start game', null)
        return
      }
      socket.emit('select', 1)
    },
  }
})


socket.on('on game', (data) => {
  gm = data
  display()
})

socket.on('init', (data) => {
  gm = data
})


function display(){
  dispYama()
  dispMine()
  dispOtherTrsh()

  function dispYama(){
    let msg = ''
    for(let card of gm.yama){
      msg += card.name
    }
    yama.message = msg
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
      p1Trsh.cards = msg //TODO 汎用的にする。
    }
  }
}
