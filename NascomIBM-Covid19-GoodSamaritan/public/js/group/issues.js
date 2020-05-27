$(document).ready(function(){
    var socket = io();
    var room= $('#issueName').val();
    var sender= $('#name-user').val();
    var userPic = $('#name-image').val();
    socket.on('connect',function(){
        var params = {
            room: room,
            name: sender
        }
        socket.emit('join',params, function(){
            //console.log('User joined a channel');
        });
    });

    socket.on('newSolution', function(data){
        //console.log(data);
        var template=$('#issue-template').html();
        var message=Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });
        $('#issue').append(message);
    });
    $('#issue-form').on('submit', function(e){
        e.preventDefault();
        var iss=$('#iss').val();
        socket.emit('createSolution', {
            text: iss,
            room: room,
            from: sender,
            image: userPic,
        }, function(){
            $('#iss').val('');
        });

        $.ajax({
            url: '/group/issues/'+room,
            type: 'POST',
            data: {
                //message: msg,
                //groupName: room
                solution: sol,
                groupName: room
            },
            success: function(){
                $('#iss').val('');
            }
        })
    });

});