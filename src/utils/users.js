const users = []

//addUser, removeUser, getUser, getUserInRoom

const addUser = ({id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    if(existingUser){
        return {
            error: 'Username already used in that room, pick another one'
        }
    }
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    /*users = users.filter((user) => {
        return user.id !== id
    })*/

    //or better because filter continues even if a match
    const index = users.findIndex((user) => {
        return user.id == id
    })
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id == id
    })
    if(index !== -1){
        return users[index]
    }else{
        return undefined
    }
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const userList = users.filter((user) => user.room === room )
    return userList
}

/*addUser({
    id: '22',
    username: 'maxime', 
    room: 'Marseille'
})

console.log(users)

let res = addUser({
    id: '22',
    username: 'maxime', 
    room: 'Marseille'
})

console.log(res)

res = addUser({
    id: '22',
    username: 'maxime', 
    room: ''
})

console.log(res)

console.log(users)

removeUser('22')

console.log(users)

addUser({
    id: '22',
    username: 'maxime', 
    room: 'Marseille'
})

addUser({
    id: '23',
    username: 'Sabrina', 
    room: 'Buenos Aires'
})

console.log(users)

console.log(getUser('22'))
console.log(getUsersInRoom('Buenos Aires'))*/

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

