$(function () {
  const socket = io('http://localhost:3000');
  $('form').submit(function(){
    let msg = $('#m').val()

    if(msg === 'display'){
      socket.emit('display', null)
      $('#m').val('');
      return false;
    }
    socket.emit('message', msg)

    $('#m').val('');
    return false;
  });

  socket.on('msg', (msg) => {
    $('#messages').append($('<li>').text(msg));
  })

  socket.on('display', (gm) => {
    for(let i in gm.players){
      for(let card of gm.players[i].holdCard){
        $(`#p${i}hold`).append($('<span>').text(card.name))
      }
      for(let card of gm.players[i].trshCard){
        $(`#p${i}trsh`).append($('<span>').text(card.name))
      }
    }
    for(let card of gm.yama){
      $(`#yama`).append($('<span>').text(card.name))
    }
  })

  socket.on('call display', (gm) => {
    socket.emit('display', null)
  })
});
