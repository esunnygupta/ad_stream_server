const admin = require('../../firebase');

// Get a database reference
var db = admin.firebase.firestore();

const add = async (req, res) => {
	console.log("Request:\n", req.body);
	const serialId = req.body.serial_id;
	const isActive = req.body.is_active;
	const doc = db.collection('devices').doc(serialId);
	await doc.get().then((result) => {
		if (result.exists) {
			console.log("Device already exists.");
			res
				.status(304)
				.json({'message': 'Device already exists.'});
		} else {
			doc.set({
				'serial_id': serialId,
				'isActive': isActive
			}).then(function(result) {
				res
					.status(200)
					.json({'message': 'Device added successfully.'});
			}).catch(function(error) {
                console.log("Error adding device: ", error);
                res
                    .status(304)
                    .json({error});
            });
		}
	});
}

module.exports = {
	add
};