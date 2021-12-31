const admin = require('../../firebase');
  
// Get a database reference
var db = admin.firebase.firestore();

const credit = async (req, res) => {
    const orders = [];
    const docs = db.collection('transactions');
    const snapshot = await docs.where('paymentType', '==', "Credit").get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        orders.push(doc.data());
    });
    res.render('credit', { 
        title: 'iSense',
        orderList: orders
    });
};

const cash = async (req, res) => {
    const orders = [];
    const docs = db.collection('transactions');
    const snapshot = await docs.where('paymentType', '==', 'Cash').get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        orders.push(doc.data());
    });
    res.render('cash', { 
        title: 'iSense',
        orderList: orders
    });
};

module.exports = {
    credit,
    cash
};

