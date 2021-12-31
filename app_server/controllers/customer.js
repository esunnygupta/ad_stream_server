const admin = require('../../firebase');
const mqttCtrl = require('../config/mqtt');

// Get a database reference
var db = admin.firebase.firestore();

const list = async (req, res) => {
    const advertise = []
    console.log("Advertisement List");
    const docs = db.collection('playlist');
    const snapshot = await docs.get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        advertise.push(doc.data());
    });
    res.render('customer', { 
        title: 'iSense',
        advertisementList: advertise
    });
};

const add = async (req, res) => {
    console.log("Request:\n", req.body);
    video_link = req.body.video_link;
    start_time = req.body.start_time;
    const doc = db.collection('playlist').doc(start_time);
    await doc.get().then((result) => {
        if(result.exists) {
            console.log("Advertisement already exists.")
            res
                .status(304)
                .json({'message': 'Advertisement already exists.'});
        } else {
            doc.set({
                'video_link': req.body.video_link,
                'start_time': req.body.start_time,
            }).then(function(result) {
                mqttCtrl.client.publish(mqttCtrl.topic, video_link, {qos: 0, retain: false}, (error) => {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.log("Advertisement added successfully.");
                        res
                            .redirect('/customer');
                    }
                })
            }).catch(function(error) {
                console.log("Error adding advertisement: ", error);
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
    code = req.params.customerId;
    console.log("Code: ", code);
    const doc = db.collection('customers').doc(code);
    await doc.get().then((result) => {
        if(result.exists) {
            doc.delete().then(function(result) {
                console.log("Customer deleted successfully.");
                res
                    .status(200)
                    .json({result})
            }).catch(function(error) {
                console.log("Error deleting customer: ", error);
                res
                    .status(304)
                    .json({error});
            });
        } else {
            console.log("Customer not found.")
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