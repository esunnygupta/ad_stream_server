const mqtt = require('mqtt');

const host = '192.168.1.6';
const port = '1883';
const clientId = `stream_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000
});

const topic = '/playlist';

client.on('connect', () => {
    console.log('Connected.');
});

module.exports = {
    client,
    topic
};