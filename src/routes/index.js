const authRoute = require('./auth.route')
const tournamentsRoute = require('./tournaments.route')
const matchesRoute = require('./matches.route')
const usersRoute = require('./users.route')

module.exports = [authRoute, tournamentsRoute, matchesRoute, usersRoute];