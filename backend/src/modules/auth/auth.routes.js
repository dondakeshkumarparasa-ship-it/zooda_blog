const express = require('express');
const { register, login } = require('./auth.controller');
const router = express.Router();

// Note: /reset-password-direct is served at root level in app.js, or mounted here. 
// We will mount registration and login here.
router.post('/register', register);
router.post('/login', login);

module.exports = router;
