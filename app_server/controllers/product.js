const admin = require('../../firebase');

// Get a database reference
var db = admin.firebase.firestore();

const list = async (req, res) => {
    const products = []
    console.log("Product List");
    const docs = db.collection('products');
    const snapshot = await docs.get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        products.push(doc.data());
    });
    res.render('product', { 
        title: 'iSense',
        productList: products
    });
};

const add = async (req, res) => {
    console.log("Request:\n", req.body);
    name = req.body.productName;
    const doc = db.collection('products').doc(name);
    await doc.get().then((result) => {
        if(result.exists) {
            console.log("Product already exists.")
            res
                .status(304)
                .json({'message': 'Product already exists.'});
        } else {
            doc.set({
                'name': req.body.productName,
            }).then(function(result) {
                console.log("Product Added successfully.");
                res
                    .redirect('/product');
            }).catch(function(error) {
                console.log("Error adding product: ", error);
                res
                    .status(304)
                    .json({error});
            });
        }
    });
};

const readOne = (req, res) => {
    console.log("Customers ReadOne");
    res
        .status(200)
        .json({});
};

const updateOne = (req, res) => {
    console.log("Customers UpdateOne");
    res
        .status(200)
        .json({});
};

const removeOne = async (req, res) => {
    console.log("Request:\n", req.params);
    name = req.params.productName;
    console.log("Code: ", name);
    const doc = db.collection('customers').doc(name);
    await doc.get().then((result) => {
        if(result.exists) {
            doc.delete().then(function(result) {
                console.log("Product deleted successfully.");
                res
                    .status(200)
                    .json({result})
            }).catch(function(error) {
                console.log("Error deleting product: ", error);
                res
                    .status(304)
                    .json({error});
            });
        } else {
            console.log("Product not found.")
            res
                .status(304)
                .json({'message': 'Customer not found'});
        }
    });
};

module.exports = {
    list,
    add,
    readOne,
    updateOne,
    removeOne
};