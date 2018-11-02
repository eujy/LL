class Player {
  constructor(name) {
    this.points = 0;
    this.name = name;
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
