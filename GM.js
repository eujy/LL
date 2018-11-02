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
  }

  init(){
    this.players.push(new player("N"))
    this.players.push(new player("R"))
    shuffle(cards)
    for(let i in cards){
      this.yama.push(new card(getPW(cards[i]),cards[i]))
    }
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
gm.init()
console.log(gm.players);
console.log(gm.yama);
