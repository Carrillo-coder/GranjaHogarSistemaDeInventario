const express = require('express');
const router = express.Router();
const LogInController = require('../Controllers/logIn.controller');

router.post('/login/:username', LogInController.handleLogIn);

module.exports = router; 