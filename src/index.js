//this way is to support socketio via express
const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)

const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
console.log(__dirname)

app.use(express.static(publicDirectoryPath))

const {genericMessage, generateLocationMessage} = require('./utils/messages')

const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

//event
//socket contains info on the connection
io.on('connection' , (socket) => {

    socket.on('sendMessage', (mess, callback) => {
        const filter = new Filter()
        if(filter.isProfane(mess)){
            return callback('Profanity is not allowed')
        }

        const user = getUser(socket.id)
        //to everyone
        //io.emit('message', genericMessage(mess))
        io.to(user.room).emit('message', genericMessage(mess, user.username))

        //acknoledge
        //callback('delivered')
        callback()
    })

    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const user = getUser(socket.id)
        //to everyone
        //io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        
        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`, user.username))
        callback()
    })

    socket.on('join', ({username, room}, callback) => {

        //or instead of {username, room} we could use "options" for instance
        //and use
        /*const {error, user} = addUser({
            id: socket.id,
            ...options
        })*/

        const {error, user} = addUser({
            id: socket.id,
            username, 
            room
        })

        if(error){
            return callback(error)
        }
        //only to that room
        socket.join(user.room)
        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit => send message to verybody to a specific room
        //socket.broadcast.io.emit => same but to a room

         //response to the socket
        socket.emit('message', genericMessage('Admin', 'Welcome!'))
    //broadcast except to the current socket 'client that sent the inital mess in that case'
    //socket.broadcast.emit('message', genericMessage('A new user has joined'))

    ///only to the room
        socket.broadcast.to(user.room).emit('message', genericMessage('Admin',`${user.username} has joined!`))

       /*console.log('emit roomData from server with: ')
        console.log(room)
        console.log(users)*/
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    //check disconnect from 1 client
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            console.log(user)
            //io.emit('message', genericMessage('A user as left'))
            io.to(user.room).emit('message', genericMessage('Admin', `${user.username} has left!`))
        
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log('serveur is up and running ' + process.env.PORT)
})

  //send event from server to client, custom event
    //socket.emit('countUpdated', count)
    //socket.emit('message', 'message')

//submit event to a single connection
        //socket.emit('countUpdated', count)

/*app.get('/',function(req,res) {
    //res.send('<h1>My Chat App<h1>')
    res.sendFile(publicDirectoryPath + '/html/index.html')
  });*/


