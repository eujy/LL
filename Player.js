class Player {
  constructor(id) {
    this.points = 0;
    this.id = id;
    this.holdCard = [];
    this.trshCard = [];
    this.isAlive = true;
    this.isProtected = false;
  }
  lose(){
    this.isAlive = false;
  }
}

var test = new Player("Jack")

//console.log(test);

module.exports = Player;
