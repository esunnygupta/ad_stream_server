const { firestore } = require('firebase-admin');
const admin = require('../../firebase');
  
// Get a database reference
var db = admin.firebase.firestore();
//db.settings({ignoreUndefinedProperties: true});

const list = async (req, res) => {
    const orders = [];
    const docs = db.collection('transactions');
    const snapshot = await docs.orderBy('date').get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        orders.push(doc.data());
    });
    res.render('analytics', { 
        title: 'iSense',
        resultList: orders
    });
};

const filter = async (req, res) => {
    const results = [];
    const docs = db.collection('transactions');
    let snapshot = await docs.get();
    let from_timestamp;
    let to_timestamp;
    console.log("Customer Code: ", req.body.customerCode);
    console.log("Product: ", req.body.product);
    console.log("From: ", req.body.date_from);
    console.log("To: ", req.body.date_to);
    if (!req.body.date_from || !req.body.date_to) {
        from_timestamp = firestore.Timestamp.fromDate(new Date("2020-01-01"));
        to_timestamp = firestore.Timestamp.fromDate(new Date());
    }
    else {
        from_timestamp = firestore.Timestamp.fromDate(new Date(req.body.date_from));
        to_timestamp = firestore.Timestamp.fromDate(new Date(req.body.date_to));
    }
    if (req.body.customerCode) {
        snapshot = await docs.where('customerId', '==', req.body.customerCode)
        .get();
    }
    if (req.body.product) {
        snapshot = await docs.where('productName', '==', req.body.product)
        .get();
    }
    if (req.body.date_from) {
        snapshot = await docs.where('date', '>=', from_timestamp)
        .get();
    }
    if (req.body.date_from && req.body.date_to) {
        snapshot = await docs.where('date', '>=', from_timestamp)
        .where('date', '<=', to_timestamp)
        .get();
    }
    if (req.body.customerCode && req.body.product) {
        snapshot = await docs.where('customerId', '==', req.body.customerCode)
        .where('productName', '==', req.body.product)
        .get();
    }
    if (req.body.customerCode && req.body.date_from && req.body.date_to) {
        snapshot = await docs.where('customerId', '==', req.body.customerCode)
        .where('date', '>=', from_timestamp)
        .where('date', '<=', to_timestamp)
        .get();
    }
    if (req.body.customerCode && req.body.product && req.body.date_from && req.body.date_to) {
        snapshot = await docs.where('customerId', '==', req.body.customerCode)
        .where('productName', '==', req.body.product)
        .where('date', '>=', from_timestamp)
        .where('date', '<=', to_timestamp)
        .get();
    }
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        results.push(doc.data());
    });
    console.log("Results:\n", results);
    res.render('analytics', {
        title: 'iSense',
        resultList: results
    });
};

module.exports = {
    list,
    filter
};