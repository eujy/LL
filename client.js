$(function () {
  const socket = io('http://localhost:3000');
  $('form').submit(function(){
    let msg = $('#m').val()
    if(msg === "start"){
      socket.emit('start', null)
    }
    if(msg === "distribute"){
      socket.emit('distribute', null)
    }

    if(msg === 'choose 0'){
      socket.emit('choose', 0)
    }
    if(msg === 'choose 1'){
      socket.emit('choose', 1)
    }
    if(msg === 'startTurn'){
      socket.emit('startTurn', null)
    }

    $('#m').val('');
    return false;
  });

  socket.on('msg', (msg) => {
    $('#messages').append($('<li>').text(msg));
  })
});
