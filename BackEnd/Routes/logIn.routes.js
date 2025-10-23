const express = require('express');
const router = express.Router();
const LogInController = require('../Controllers/logIn.controller');

router.post('/:username', LogInController.handleLogIn);

module.exports = router; 