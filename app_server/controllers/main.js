const admin = require('../../firebase');
  
// Get a database reference
var db = admin.firebase.firestore();

const index = async (req, res) => {
    const orders = [];
    const docs = db.collection('transactions');
    const snapshot = await docs.get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        orders.push(doc.data());
    });
    res.render('dashboard', { 
        title: 'iSense',
        orderList: orders
    });
};

module.exports = {
    index
};