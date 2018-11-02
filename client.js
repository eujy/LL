$(function () {
  const socket = io('http://localhost:3000');
  $('form').submit(function(){
    let msg = $('#m').val()
    if(msg === "check"){
      socket.emit('check', null)
    } else {
      socket.emit('chat message', msg);
    }

    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('msg', (msg) => {
    $('#messages').append($('<li>').text(msg));
  })
});