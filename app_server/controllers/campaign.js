const admin = require('../../firebase');
const mqttCtrl = require('../config/mqtt');
const schedule = require('node-schedule');

// Get a database reference
var db = admin.firebase.firestore();

const list = async (req, res) => {
    const advertise = [];
    const videos = [];
    console.log("Advertisement List");
    const docs = db.collection('playlist');
    const snapshot = await docs.get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        advertise.push(doc.data());
    });
    const video_docs = db.collection('uploads');
    const video_snapshot = await video_docs.get();
    video_snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        videos.push(doc.data());
    })
    res.render('campaign', { 
        title: 'iSense',
        advertisementList: advertise,
        videoList: videos
    });
};

const add = async (req, res) => {
    console.log("Request:\n", req.body);
    let video_link = "";
    const campaign_name = req.body.campaign_name;
    const video_docs = db.collection('uploads');
    const snapshot = await video_docs.where('video_name', '==', campaign_name).get();
    if (snapshot.empty) {
        console.log("No documents found.");
        res
            .status(304)
            .json({'message': 'No video found.'});
    }
    snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
        video_link = doc.data().video_link;
    });
    const start_time = req.body.start_time;
    const doc = db.collection('playlist').doc(start_time);
    await doc.get().then((result) => {
        if(result.exists) {
            console.log("Advertisement already exists.")
            res
                .status(304)
                .json({'message': 'Advertisement already exists.'});
        } else {
            doc.set({
                'campaign_name': campaign_name,
                'video_link': video_link,
                'start_time': start_time,
            }).then(function(result) {
                const json_message = {
                    link: video_link,
                    time: start_time 
                };
                const jsonString = JSON.stringify(json_message);
                var scheduledDate = new Date(start_time);
                console.log("Scheduled time is: ", scheduledDate);
                schedule.scheduleJob(scheduledDate, function() {
                    console.log("running scheduled job...");
                    mqttCtrl.client.publish(mqttCtrl.topic, jsonString, {qos: 0, retain: false}, (error) => {
                        if (error) {
                            console.error(error);
                        }
                        else {
                            console.log("Published: ", jsonString);
                        }
                    })
                });
                res
                    .redirect('/campaign');
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
    console.log("Campaign ReadOne");
    res
        .status(200)
        .json({});
};

const updateOne = (req, res) => {
    console.log("Campaign UpdateOne");
    res
        .status(200)
        .json({});
};

const removeOne = async (req, res) => {
    console.log("Request:\n", req.params);
    code = req.params.customerId;
    console.log("Code: ", code);
    const doc = db.collection('playlist').doc(code);
    await doc.get().then((result) => {
        if(result.exists) {
            doc.delete().then(function(result) {
                console.log("Campaign deleted successfully.");
                res
                    .status(200)
                    .json({result})
            }).catch(function(error) {
                console.log("Error deleting campaign: ", error);
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