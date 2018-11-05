const CardEffects = require("./CardEffects")
// const Card = require("./Card")

class GM extends CardEffects {
  constructor() {
    super()
  }

  init(){
    this.playingPlayer = 0
    this.getIdList()
    this.yama = []
    this.isFinished = false
    this.winner = null

    // this.players.push(new Player("N"))
    // this.players.push(new Player("R"))
    this.getCardList()
    this.createDeck()
    this.shuffle(this.yama)
    // for(let i in this.players){//ダミーカードをtrshに置いておく
    //   this.players[i].trshCard.push(new Card(0,"dummy"));
    // }
    for(let i in this.players){
      this.distribute(i)
    }
  }

  startTurn(){
    this.distribute(this.playingPlayer)
    this.players[this.playingPlayer].isProtected = false
    this.doDaijin()
  }

  endTurn(cardIdx, cardName, player, chosenCardName,){
    this.doCard(cardName,player,chosenCardName, this.playingPlayer)
    this.choose(this.playingPlayer, cardIdx)
    for(let player of this.players){
      if(player.trshCard.length > 0){
        if (player.trshCard[player.trshCard.length-1].name === "Hime") {
          player.lose()
        }
      }
    }
    if(this.countPlayers() === 1){//残ってるプレーヤーが一人だったらゲーム終了
      this.gameFinished()
    }
    if(this.yama.length === 0){//山のカードがなくなったらゲーム終了
      this.gameFinished()
    }
    this.nextPlayer()
  }
}

module.exports = GM;
