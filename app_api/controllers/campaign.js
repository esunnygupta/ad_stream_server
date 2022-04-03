const admin = require('../../firebase');

var db = admin.firebase.firestore();

const list = async (req, res) => {
	const advertise = [];

	console.log("Advertisement List");
	const docs = db.collection('playlist');
    const snapshot = await docs.get();
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        advertise.push(doc.data());
    });
	res
		.status(200)
		.json({advertise});
};

module.exports = {
	list
};