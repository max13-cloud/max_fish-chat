const genericMessage = (message, from) => {
    return {
        text: message,
        createdAt: new Date().getTime(),
        from
    }
}

const generateLocationMessage = (url, from) => {
    return {
        url,
        createdAt: new Date().getTime(),
        from
    }
}

module.exports = {
    genericMessage,
    generateLocationMessage
}