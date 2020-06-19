const jwt = require('jsonwebtoken')

const getUserId = (request, requireAuth = true) => {
    const header = request.event ? request.event.headers.Authorization : request.connection.context.Authorization

    if (header) {
        const token = header.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'abcdefghijklmnop')
        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    } 
    
    return null
}

module.exports.getUserId = getUserId;