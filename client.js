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

    $('#m').val('');
    return false;
  });

  socket.on('msg', (msg) => {
    $('#messages').append($('<li>').text(msg));
  })
});