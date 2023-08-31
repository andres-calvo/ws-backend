const http=require('http')
const uuidv4=require("uuid").v4
const xss = require("xss")

const server= http.createServer()

const io=require('socket.io')(server,{ cors: {origin:'*'}
})

io.on('connection', (socket)=>{


    //Cada vez que se conecta un nuevo usuario, les llega esta información de que se ha conectado un nuevo user
    socket.broadcast.emit('chat_message', {
        usuario: 'INFO',
        mensaje: 'Se ha conectado un nuevo usuario'
    });

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data);
    });

    // Manejar la creación y unión a una sala
    socket.on('joinRoom', (room) => {
        console.log(`Cliente se unió a la sala: ${room}`);
    });
    
    // Manejar el evento de mensaje en una sala
    socket.on('sendMessage', (message) => {
        io.emit(message.room, {
            id:uuidv4(),
            username:xss(message.username),
            message:xss(message.message),
            room:message.room
        });
        console.log(`Mensaje enviado en la sala ${message.room}: ${xss(message.message)}`);
    });
    

})


server.listen(4000)