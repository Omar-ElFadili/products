const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.findOneUser);
router.post('/login', userController.login);
router.post('/verify/:id/:token', userController.verificationUser);
module.exports = router;