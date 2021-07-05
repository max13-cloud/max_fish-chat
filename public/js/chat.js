//Init client to get socket object like we have on server side
const socket = io()
const messForm = document.querySelector('#message-form')
const inputMess = messForm.querySelector('#input-message')
const messageFormButton = messForm.querySelector('#send-message')
const $messageLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const $locations = document.querySelector('#locations')

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    //get new message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyles($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $newMessage.offsetHeight

    //Height of messages container
    const containerHeight = $newMessage.scrollHeight

    //how far I have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (mess) => {
    console.log(mess)
    const html = Mustache.render(messageTemplate, {
        message: mess.text,
        createdAt: moment(mess.createdAt).format('h:mm a'), 
        from: mess.from
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationObj) => {
    //console.log(location)
    const html = Mustache.render(locationTemplate, {
        location: locationObj.url,
        createdAt: moment(locationObj.createdAt).format('h:mm a'),
        from: locationObj.from
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({room, users}) => {
    console.log('receiving roomData from server with: ')
    console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').insertAdjacentHTML('beforeend', html)
})

if(messForm){
    messForm.addEventListener('submit', (e) => {
        // prevent from reloading the page
        e.preventDefault()

        //at this point disable the form
        messageFormButton.setAttribute('disabled', 'disabled')
        messageFormButton.value = ''
        messageFormButton.focus()

        //socket.emit('sendMessage', inputMess.value)
        //or
        socket.emit('sendMessage', e.target.elements.message.value, (error) => {
            e.target.elements.message.value = ''
            messageFormButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            //event ackno
            console.log('the message was delivered')
        })
        //here it works with id=message but not with input-message for instance.
    })
}

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $messageLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition( (position) => {
        console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $messageLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
        if(error){
            alert(error)
            location.href = '/'
        }
})






/*socket.on('countUpdated', (count) => {
    console.log('The count has been updated ' + count)
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log('click')
    socket.emit('increment')
})*/