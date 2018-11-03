$(function () {
  const socket = io('http://localhost:3000');
  let isFinished = true
  let gm = null
  
  socket.on('on game', (data) => {
    gm = data
    display()
  })

  function click(num){
    if(isFinished){
      socket.emit('start game', null)
      return
    }
    socket.emit('select', num)
  }

  function display(){
    dispYama()
    dispMyHold()
  }

  function dispYama(){
    for(let card of gm.yama){
      $(`#yama`).append($('<span>').text(card.name))
    }
  }

  function dispMyHold(){ //今はhold and trush
    for(let i in gm.players){
      for(let card of gm.players[i].holdCard){
        $(`#p${i}hold`).append($('<span>').text(card.name))
      }
      for(let card of gm.players[i].trshCard){
        $(`#p${i}trsh`).append($('<span>').text(card.name))
      }
    }
  }

  $('#b-one').on('click', function() {
    click(1)
  });
  $('#b-two').on('click', function() {
    click(2)
  });
  $('#b-three').on('click', function() {
    click(3)
  });
  $('#b-four').on('click', function() {
    click(4)
  });
  $('#b-five').on('click', function() {
    click(5)
  });
  $('#b-six').on('click', function() {
    click(6)
  });
  $('#b-seven').on('click', function() {
    click(7)
  });
  $('#b-eight').on('click', function() {
    click(8)
  });

  socket.on('init', (data) => {
    gm = data
  })
  
});
