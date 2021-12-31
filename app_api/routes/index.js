const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/users');

// user
router
    .route('/user/register')
    .post(ctrlUser.register);

router
    .route('/user/login')
    .post(ctrlUser.login);

module.exports = router
