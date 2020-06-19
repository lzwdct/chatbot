const bcrypt = require('bcryptjs')

const hashPassword = (password) => {
    if (password.length < 4) {
        throw new Error('Password must be 4 characters or longer.')
    }

    return bcrypt.hash(password, 10)
}

module.exports.hashPassword = hashPassword;