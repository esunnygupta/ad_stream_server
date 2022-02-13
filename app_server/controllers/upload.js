const admin = require('../../firebase');
const multer = require('multer');
const {v4 : uuidv4} = require('uuid')
const AWS = require('aws-sdk');

// Get a database reference
var db = admin.firebase.firestore();

const list = async (req, res) => {
    const videos = [];
    const video_docs = db.collection('uploads');
    const video_snapshot = await video_docs.get();
    video_snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        videos.push(doc.data());
    });
    res.render('upload', {
        title: 'iSense',
        videoList: videos
    });
};

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});

const uploadS3 = multer({storage}).single('video');

const add = async (req, res) => {
    let video_name = req.body.video_name;
    let video_link = req.body.video_link;

    const doc = db.collection('uploads').doc(video_name);
    
    if (!video_link)
    {
        console.log(req.file);

        let filename = req.file.originalname.split(".");
        const fileType = filename[filename.length - 1];
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuidv4()}.${fileType}`,
            Body: req.file.buffer
        };

        s3.upload(params, (error, data) => {
            if (error) {
                res.status(500).send(error);
            }
            console.log("Data:\n", data);
            video_link = data.Location;
            doc.get().then((result) => {
                if (result.exists) {
                    console.log("Video name already exists.");
                    res
                        .status(304)
                        .json({'message': 'Video name already exists.'});
                } else {
                    doc.set({
                        'video_name': video_name,
                        'video_link': video_link
                    }).then(function(result) {
                        res
                            .redirect('/campaign');
                    }).catch(function(error) {
                        res
                            .status(304)
                            .json({error});
                    });
                }
            });
        });
    } else {
        await doc.get().then((result) => {
            if (result.exists) {
                console.log("Video name already exists.");
                res
                    .status(304)
                    .json({'message': 'Video name already exists.'});
            } else {
                doc.set({
                    'video_name': video_name,
                    'video_link': video_link
                }).then(function(result) {
                    res
                        .redirect('/campaign');
                }).catch(function(error) {
                    res
                        .status(304)
                        .json({error});
                });
            }
        });
    }
};

module.exports = {
    list,
    add,
    uploadS3
};