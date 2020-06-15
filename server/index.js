const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const rooms = [];
const users = {};
const state = {};
app.get('/', (req,res) => {
    res.send('<h1>From Socket IO</h1>');
});

io.on('connection', (socket) => {
   
    console.log('user connected', socket.client.id);
    users[socket.client.id] = socket;
    socket.emit('broadcast','connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        console.log(msg);
    });

    /**
     * Creating a room which users can join n play
     * Restrict room size to two players 
     */
    socket.on('create', (initState) => {
        const roomId = createRoom();
        socket.join(roomId);  
        state[roomId] = {...initState};
        console.log(socket.client.id);  
        socket.emit('roomId', roomId);    
    });

    socket.on('startGame', (roomId, state) => {
        socket.to(roomId).emit('startGame');
        state[roomId] = {...state};
        socket.emit('startGame',state);
    });
    socket.on('join', (roomId, gameState) => {
        if(rooms.indexOf(roomId) !== -1){
            const rooms =io.nsps['/'].adapter.rooms;
            const socketId = socket.id;
            console.log(socketId);
            console.log(rooms[roomId].length);
            if(rooms && rooms[roomId].length < 2){
                // users[socket.client.id].emit('connError', 'rooms full');
                socket.join(roomId);
                socket.emit('roomId', roomId);  
                
            } else {
                socket.emit('connError', 'rooms full'); 
            }

            if(rooms && rooms[roomId].length === 2){
                socket.to(roomId).emit('readyToStart', gameState);
                socket.emit('readyToStart', state[roomId]);
            }
            
        }
    });


});

function createRoom(){
    const roomId = parseInt(Math.random()*Date.now()).toString().slice(0,8);

    if(rooms.indexOf(roomId) === -1) {
        rooms.push(roomId);
        return roomId;
    } 
    return createRoom();
}
server.listen(3000, () => {
    console.log('Listening on 3000...');
})