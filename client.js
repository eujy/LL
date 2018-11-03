$(function () {
  const socket = io('http://localhost:3000');
  $('form').submit(function(){
    let msg = $('#m').val()

    if(msg === 'display'){
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
    for(let player of gm.players){
      for(let card of player.holdCard){
        $(`#--ここをidに変える--`).append($('p').text(card.name))
      }
      for(let card of player.trshCard){
        $(`#--ここをidに変える--`).append($('p').text(card.name))
      }
    }
    for(let card of gm.yama){
      $(`#--ここをidに変える--`).append($('p').text(card.name))
    }
  })

  socket.on('call display', (gm) => {
    socket.emit('display', null)
  })
});
