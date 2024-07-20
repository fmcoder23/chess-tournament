const { Router } = require('express');
const { create, update, remove, show, showPersonal, assignPlayer, startTournament, getLeaderboard } = require('../controllers/tournaments.controller');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { isAuth } = require('../middlewares/is-auth.middleware');
const router = Router();

router.post('/tournaments', isAdmin, create);
router.put('/tournaments/:id', isAdmin, update);
router.delete('/tournaments/:id', isAdmin, remove);
router.get('/tournaments', show)
router.get('/tournaments/personal', isAuth, showPersonal)
router.post('/tournaments/assign', isAdmin, assignPlayer)
router.post('/tournaments/start/:tournament_id', isAdmin, startTournament)
router.get('/tournaments/leaderboard/:tournament_id', getLeaderboard);

module.exports = router;