const env = require('dotenv');
env.config();
const ip = process.env.BROKER_IP;
const mqtt = require('mqtt')
const client = mqtt.connect("mqtt://" + ip);
const sequelize = require('../config/database');
const Student = require('../app/models/Student')
const Attendance = require('../app/models/Attendance')

var rfid = "";
var temp = "";
var userData;

client.on('connect', function () {
    console.log("Connected");
    client.subscribe('ESP32/rfid', {qos:2}, function (err) {
    })
    client.subscribe('ESP32/temp', {qos:2}, function (err) {
    })
})

exports.receiveMessage = async (req, res, next) => {
    client.on('message', function (topic, message) {
        // message is Buffer
        if (topic == "ESP32/rfid") {
            console.log("Received message on topic " + topic)
            console.log(message.toString())
            rfid = parseInt(message.toString()).toString;
        }
        else if (topic == "ESP32/attendance") {
            console.log("Received message on topic " + topic)
            console.log(message.toString())
            data.push(message);
        }

        if (rfid) {
            Student.findOne({
                where: { RFIDcode: rfid }
            }).then(async (user) => {
                if (user) {
                    var message = "ok";
                    await sendStatus(message)
                }
            })
                .catch(err => console.log(err));;
        }
    })
}

client.on('message', function (topic, message) {
    // message is Buffer
    if (topic == "ESP32/rfid") {
        console.log("Received message on topic " + topic)
        console.log(message.toString())
        rfid = message.toString();
        rfid = rfid.replace(/\s/g, '');

        if (rfid) {
            Student.findOne({
                where: { RFIDcode: rfid }
            }).then(async (user) => {
                if (user) {
                    userData = user.StudentID;
                    var message = "ok";
                    sendStatus(message)
                }
                else{
                    var message = "error";
                    sendStatus(message);
                }
            })
                .catch(err => console.log(err));;
        }
    }
    else if (topic == "ESP32/temp" && userData != null) {
        console.log("Received message on topic " + topic)
        console.log(message.toString())
        temp = message.toString();
        temp = parseFloat(temp);

        if (temp) {
            const atten = new Attendance({
                checkInDateTime: sequelize.fn('CURRENT_TIMESTAMP'),
                tempReading: temp,
                RFIDcode: rfid,
                StudentID: userData,
            });
            atten.save();
        }
    }
})

exports.getData = async (req, res, next) => {
    return data;
}

async function sendStatus(status) {
    client.publish('ESP32/rfidstatus', status, {qos:2}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('Published to ESP32/rfidstatus')
        }
    })
}