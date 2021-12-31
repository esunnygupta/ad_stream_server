const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/stream';

mongoose.set('useCreateIndex', true)
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', () => {
    console.log("Mongoose connected to", dbURI);
});

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose disconnected");
});

const terminateApp = (msg, callback) => {
    mongoose.connection.close( () => {
        console.log('Mongoose disconnected through', msg);
        callback();
    });
};

process.once('SIGUSR2', () => {
    terminateApp('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
}); 

process.once('SIGINT', () => {
    terminateApp('app termination', () => {
        process.exit(0);
    });
});

process.once('SIGTERM', () => {
    terminateApp('server app shutdown', () => {
        process.exit(0);
    });
});

require('./users');

