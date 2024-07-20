require('dotenv/config')

const config = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
}

module.exports = { config };