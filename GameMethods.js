const Player = require('./Player');

class GameMethods {
  constructor(){
    this.yama = [];
    this.players = [];
    this.idList = {}
    this.isFinished = false;
    this.playingPlayer = null
    this.winner = null
  }

  addPlayer(id){
    this.players.push(new Player(id))
  }
  removePlayer(id){
    for(let i in this.players){
      if(this.players[i].id === id){
        this.players.splice(i,1)
        break
      }
    }
  }
  getIdList(){
    for(let i in this.players){
      this.idList[this.players[i].id] = i
    }
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
    console.log('distribute', this.players)
    this.players[player].holdCard.push(this.yama[0])
    this.yama.shift()
  }

  choose(player,cardIdx){
    this.players[player].trshCard.push(this.players[player].holdCard[cardIdx])
    this.players[player].holdCard.splice(cardIdx,1)
  }

  countPlayers(){
    var c = 0;
    for(let player of this.players){
      if(player.isAlive){
        c++;
      }
    }
    return c;
  }

  nextPlayer(){
    this.playingPlayer++;
    if(this.players.length === this.playingPlayer){
      this.playingPlayer = 0;
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

module.exports = GameMethods;
