const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');
const ctrlAdmin = require('../controllers/admin');
const ctrlCampaign = require('../controllers/campaign');
const ctrlProduct = require('../controllers/product');
const ctrlAnalytics = require('../controllers/analytics');
const ctrlUpload = require('../controllers/upload');

/* GET home page. */
router.get('/', ctrlMain.index);

/* GET dashboard. */
router.get('/dashboard', ctrlMain.index);

/* GET Analytics. */
router
    .route('/analytics')
    .get(ctrlAnalytics.list)
    .post(ctrlAnalytics.filter);

/* Populate page with credit transactions */
router.get('/transactions/credit', ctrlAdmin.credit);
router.get('/transactions/cash', ctrlAdmin.cash);

/* Campaign CRUD */
router
    .route('/campaign')
    .get(ctrlCampaign.list)
    .post(ctrlCampaign.add);

router
    .route('/campaign/:campaignId')
    .get(ctrlCampaign.readOne)
    .put(ctrlCampaign.updateOne)
    .delete(ctrlCampaign.removeOne);

/* Upload S3 */
router
    .route('/upload')
    .get(ctrlUpload.list)
    .post(ctrlUpload.uploadS3, ctrlUpload.add);

/* Product CRUD */
router
    .route('/product')
    .get(ctrlProduct.list)
    .post(ctrlProduct.add);

router
    .route('/product/:productName')
    .get(ctrlProduct.readOne)
    .put(ctrlProduct.updateOne)
    .delete(ctrlProduct.removeOne);

module.exports = router;
