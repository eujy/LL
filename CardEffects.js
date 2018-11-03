const GameMethods = require("./GameMethods")

const Card = require("./Card")

class CardEffects extends GameMethods {
  constructor(){
    super()
    this.cardsInfo = [
      {"card": new Card(1, "Heisi"), "howmany": 5, "action": ["whom","card"]},
      {"card": new Card(2, "Doke"), "howmany": 2, "action": ["whom"]},
      {"card": new Card(3, "Kishi"), "howmany": 2, "action": ["whom"]},
      {"card": new Card(4, "Soryo"), "howmany": 2, "action": null},
      {"card": new Card(5, "Majutusi"), "howmany": 2, "action": ["whom"]},
      {"card": new Card(6, "Shogun"), "howmany": 1, "action": ["whom"]},
      {"card": new Card(7, "Daijin"), "howmany": 1, "action": null},
      {"card": new Card(8, "Hime"), "howmany": 1, "action": null},
    ]
  }

  createDeck(){
    for(let cardInfo of this.cardsInfo){
      for(let i = 0; i < cardInfo.howmany; i++){
        this.yama.push(cardInfo.card)
      }
    }
  }

  nextAction(card){
    for(let cardInfo of this.cardsInfo){
      if(card === cardInfo.card.name){
        return cardInfo.action
      }
    }
  }

  getCardList(){
    return this.cardsInfo.map(cardInfo => cardInfo.card.name)
  }

  doCard(playedCard,whom,chosenCard,me){
    if(card === "Heisi"){//対象プレイヤーとカードを選び、当たっていたら対象プレイヤーは脱落
      if(this.players[whom].holdCard[0].name === chosenCard){
        this.players[whom].lose()
      }
      return
    }
    if(playedCard === "Doke"){//対象プレイヤーの手札を見る
      return this.players[whom].holdCard[0];
    }
    if(playedCard === "Kishi"){//対象プレイヤーとカードの強さを比較して弱かったほうが脱落
      if(this.players[whom].holdCard[0].power > this.players[me].holdCard[0].power){
        this.players[me].lose()
      }else if(this.players[whom].holdCard[0].power < this.players[me].holdCard[0].power){
        this.players[whom].lose()
      }else{

      }
      return
    }
    if(playedCard === "Soryo"){
      this.player[me].isProtected = true
      return
    }
    if(playedCard === "Majutusi"){
      this.players[whom].trshCard.push(this.players[whom].holdCard[0])
      this.distribute(whom)
      return
    }
    if(playedCard === "Shogun"){
      this.players[whom].holdCard.push(this.players[me].holdCard[0])
      this.players[me].holdCard.push(this.players[whom].holdCard[0])
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