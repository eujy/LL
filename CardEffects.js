const GameMethods = require("./GameMethods")

const Card = require("./Card")

class CardEffects extends GameMethods {
  constructor(){
    super()
    this.cardsInfo = [
      {"card": new Card(1, "Heisi"), "howmany": 5},
      {"card": new Card(2, "Doke"), "howmany": 2},
      {"card": new Card(3, "Kishi"), "howmany": 2},
      {"card": new Card(4, "Soryo"), "howmany": 2},
      {"card": new Card(5, "Majutusi"), "howmany": 2},
      {"card": new Card(6, "Shogun"), "howmany": 1},
      {"card": new Card(7, "Daijin"), "howmany": 1},
      {"card": new Card(8, "Hime"), "howmany": 1},
    ]
  }

  createDeck(){
    for(let cardInfo of this.cardsInfo){
      for(let i = 0; i < cardInfo.howmany; i++){
        this.yama.push(cardInfo.card)
      }
    }
  }

  doCard(card,player,chosenCard,me){
    if(card === "Heisi"){//対象プレイヤーとカードを選び、当たっていたら対象プレイヤーは脱落
      if(this.players[player].holdCard[0].name === chosenCard){
        this.players[player].lose()
      }
      return
    }
    if(card === "Doke"){//対象プレイヤーの手札を見る
      return this.players[player].holdCard[0];
    }
    if(card === "Kishi"){//対象プレイヤーとカードの強さを比較して弱かったほうが脱落
      if(this.players[player].holdCard[0].power > this.players[me].holdCard[0].power){
        this.players[me].lose()
      }else if(this.players[player].holdCard[0].power < this.players[me].holdCard[0].power){
        this.players[player].lose()
      }else{

      }
      return
    }
    if(card === "Soryo"){
      this.player[me].isProtected = true
      return
    }
    if(card === "Majutusi"){
      this.players[player].trshCard.push(this.players[player].holdCard[0])
      this.distribute(player)
      return
    }
    if(card === "Shogun"){
      this.players[player].holdCard.push(this.players[me].holdCard[0])
      this.players[me].holdCard.push(this.players[player].holdCard[0])
      return
    }
  }

  doDaijin(){
    if(this.players[this.playingPlayer].holdCard[0] === "Daijin" || this.players[this.playingPlayer].holdCard[1] === "Daijin"){
      if(this.players[this.playingPlayer].holdCard[0].power + this.players[this.playingPlayer].holdCard[1].power > 12){
        this.player[this.playingPlayer].lose()
      }
    }
  }

}

module.exports = CardEffects