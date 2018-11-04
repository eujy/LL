class GameMethods {
  constructor(){
    this.yama = [];
    this.players = [];
    this.isFinished = false;
    this.playingPlayer = 0;
    this.winner = null
  }

  shuffle(array){
    var n = array.length, t, i;

    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
  }

  distribute(player){
    if(player === null){
      player = this.playingPlayer
    }
    this.players[player].holdCard.push(this.yama[0])
    this.yama.shift()
  }

  choose(player,cardIdx){
    this.players[player].trshCard.push(this.players[player].holdCard[cardIdx])
    this.players[player].holdCard.splice(cardIdx,1)
    console.log('choose', this.players[this.playingPlayer])
    // return this.players[player].trshCard[0].name
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

}

module.exports = GameMethods