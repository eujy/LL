const Player = require('./Player');
const CardEffects = require("./CardEffects")

class GM extends CardEffects {
  constructor() {
    super()
    this.cardList = ["Heisi","Doke","Kishi","Soryo","Majutusi","Shogun","Daijin","Hime"]
  }

  init(){
    this.players =[]
    this.players.push(new Player("N"))
    this.players.push(new Player("R"))
    this.createDeck()
    this.shuffle(this.yama)
    for(let i in this.players){
      this.distribute(i)
    }
  }

  startTurn(){
    this.distribute(this.playingPlayer)
    this.players[this.playingPlayer].isProtected = false
    this.doDaijin()
  }

  endTurn(card,player,chosenCard){
    this.doCard(card,player,chosenCard, this.playingPlayer)
    if(this.countPlayers === 1){//残ってるプレーヤーが一人だったらゲーム終了
      this.gameFinished()
    }
    if(this.yama.length === 0){//山のカードがなくなったらゲーム終了
      this.gameFinished()
    }
    for(let v of this.players){
      if(v.trshCard.length > 0 && v.trshCard[v.trshCard.length-1].name === "Hime"){
        v.lose()
      }
    }
    //プレイヤーが生きている限り、順番を回す。
    while (this.players[this.playingPlayer].isAlive === false) {
        this.playingPlayer++;
        if(this.players.length === this.playingPlayer){
          this.playingPlayer = 0;
        }
    }
  }

  gameFinished(){
    this.isFinished = true
    for(let player of this.players){
      if(player.isAlive){
        this.winner = player.name
      }
    }
  }
}

module.exports = GM;
