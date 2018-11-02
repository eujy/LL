var player = require('./Player');
var card = require("./Card")
// var Player = new player("Jack2");
// console.log(Player)


const cards = ["Heisi","Heisi","Heisi","Heisi","Heisi","Doke","Doke","Kishi","Kishi","Soryo","Soryo","Majutusi","Majutusi","Shogun","Daijin","Hime"]
function getPW(card){
if(card === "Heisi"){
  return 1;
}
if(card === "Doke"){
  return 2;
}
if(card === "Kishi"){
  return 3;
}
if(card === "Soryo"){
  return 4;
}
if(card === "Majutusi"){
  return 5;
}
if(card === "Shogun"){
  return 6;
}
if(card === "Daijin"){
  return 7;
}
if(card === "Hime"){
  return 8;
}
}

class GM {
constructor() {
  this.yama = [];
  this.players = [];
  this.ba = [];
  this.isFinished = false;
  this.playingPlayer = 0;
}

init(){
  this.players.push(new player("N"))
  this.players.push(new player("R"))
  shuffle(cards)
  for(let i in cards){
    this.yama.push(new card(getPW(cards[i]),cards[i]))
  }
  for(let i in this.players){
    this.distribute(i)
  }
}

distribute(player){
  if(player === null){
    player = this.playingPlayer
  }
  this.players[player].holdCard.push(this.yama[0])
  this.yama.shift()
}

choose(player,chosenCard){
  this.players[player].trshCard.push(this.players[player].holdCard[chosenCard])
  this.players[player].holdCard.splice(chosenCard,1)

}

startTurn(){
  this.distribute(this.playingPlayer)
  this.players[this.playingPlayer].isProtected = false
  this.doDaijin()
}


endTurn(card,player,chosenCard){
  this.doCard(card,player,chosenCard)
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

countPlayers(){
  var c = 0;
  for(let v of this.players){
    if(v.isAlive){
      c++;
    }
  }
  return c;
}

doCard(card,player,chosenCard,me){
  if(card === "Heisi"){//対象プレイヤーとカードを選び、当たっていたら対象プレイヤーは脱落
    if(this.players[player].holdCard[0].name === chosenCard){
      this.players[player].lose()
    }
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
  }
  if(card === "Soryo"){
    this.player[me].isProtected = true
  }
  if(card === "Majutusi"){
    this.players[player].trshCard.push(this.players[player].holdCard[0])
    this.distribute(player)
  }
  if(card === "Shogun"){
    this.players[player].holdCard.push(this.players[me].holdCard[0])
    this.players[me].holdCard.push(this.players[player].holdCard[0])
  }

}

doDaijin(){
  if(this.players[this.playingPlayer].holdCard[0] === "Daijin" || this.players[this.playingPlayer].holdCard[1] === "Daijin"){
    if(this.players[this.playingPlayer].holdCard[0].power + this.players[this.playingPlayer].holdCard[1].power > 12){
      this.player[this.playingPlayer].lose()
    }
  }
}

gameFinished(){

}
}

function shuffle(array) {
var n = array.length, t, i;

while (n) {
  i = Math.floor(Math.random() * n--);
  t = array[n];
  array[n] = array[i];
  array[i] = t;
}
return array;
}



const gm = new GM();

console.log(gm);
gm.init()
// console.log(gm.players);
// console.log(gm.yama);
console.log(gm);
gm.distribute(0)
console.log(gm.players[0]);
gm.choose(0,0)
gm.startTurn()
gm.endTurn(0,0,0)
console.log(gm.players[0]);


module.exports = GM;
