const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'abcdefghijklmnop', { expiresIn: '7 days' })
}

module.exports.generateToken = generateToken;