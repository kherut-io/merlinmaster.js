const router = require('express').Router();

const controller = require('../controllers/user.controller');

router.get('/', (req, res) => {
    controller.getUser(req, res);
});

router.get('/profiles/:name', (req, res) => {
    controller.getProfile(req, res);      
});

router.delete('/profiles/:name', (req, res) => {
    controller.removeProfile(req, res);      
});

router.put('/profiles/:name', (req, res) => {
    controller.editProfile(req, res);      
});

router.post('/profiles/new', (req, res) => {
    controller.newProfile(req, res);
});

router.get('/:property', (req, res) => {
    controller.getUserData(req, res);      
});

module.exports = router;