const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/users');
const ctrlCampaign = require('../controllers/campaign');

// user
router
    .route('/user/register')
    .post(ctrlUser.register);

router
    .route('/user/login')
    .post(ctrlUser.login);

router
    .route('/campaign')
    .get(ctrlCampaign.list);

module.exports = router
