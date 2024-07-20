const {Router} = require('express');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { getUsers, getLeaderboard, create, update, remove } = require('../controllers/users.controller');
const router = Router();

router.get('/users', isAdmin, getUsers);
router.get('/users/leaderboard', getLeaderboard)
router.post('/users', isAdmin, create)
router.put('/users/:id', isAdmin, update)
router.delete('/users/:id', isAdmin, remove)

module.exports = router;