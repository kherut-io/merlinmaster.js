const router = require('express').Router();

const controller = require('../controllers/user.controller');

router.get('/', (req, res) => {
    controller.getUser(req, res);
});

module.exports = router;