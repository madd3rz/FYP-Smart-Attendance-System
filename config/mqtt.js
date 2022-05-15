const mqtt = require('mqtt');
const client = mqtt.connect('127.0.0.1');

module.exports = mqtt;