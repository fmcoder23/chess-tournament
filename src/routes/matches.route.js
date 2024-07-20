const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin.middleware');
const { updateMatch, showMatches, showPersonal } = require('../controllers/matches.controller');
const { isAuth } = require('../middlewares/is-auth.middleware');
const router = Router();

router.put('/matches/:id', isAdmin, updateMatch);
router.get('/matches', isAdmin, showMatches);
router.get('/matches/personal', isAuth, showPersonal)

module.exports = router;