const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');
const ctrlAdmin = require('../controllers/admin');
const ctrlCustomer = require('../controllers/customer');
const ctrlProduct = require('../controllers/product');
const ctrlAnalytics = require('../controllers/analytics');

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

/* Customer CRUD */
router
    .route('/customer')
    .get(ctrlCustomer.list)
    .post(ctrlCustomer.add);

router
    .route('/customer/:customerId')
    .get(ctrlCustomer.readOne)
    .put(ctrlCustomer.updateOne)
    .delete(ctrlCustomer.removeOne);

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
