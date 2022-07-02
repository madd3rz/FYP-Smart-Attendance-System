const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const sequelize = require('../../config/database');
const pdf = require('html-pdf');
var options = {
    "format": 'A4',
    "border": {
        "top": "20px",
        "bottom": "25px",
        "left": "10px"
    },
    "orientation": "landscape"
};

const errMsg = (req) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    return message;
}

const infoMsg = (req) => {
    let message = req.flash('info');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    return message;
}

const oldInput = (req) => {
    let oldInput = req.flash('oldInput');
    if (oldInput.length > 0) {
        oldInput = oldInput[0];
    } else {
        oldInput = null;
    }
    return oldInput;
}


exports.generateReportPage = async (req, res) => {
    res.render('generate-report', { pageTitle: 'Generate Report', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req) });
}

exports.getDailyReport = async (req, res) => {

    var mylist;
    var { th, tr } = {};
    whereCondition = { checkInDateTime: sequelize.where(sequelize.fn('DATE', sequelize.col('Attendance.checkInDateTime')), sequelize.fn('curdate')), };
    const condition = {
        where: whereCondition, include: { model: Student, attributes: [['StudentName', 'Student Name'],] }, raw: true, nest: true, required: true, order: [
            ['checkInDateTime', 'DESC'],
        ], attributes: [['recordID', 'No'], ['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID'],]
    };

    await Attendance.findAll(condition)
        .then(list => {
            mylist = list;
        })
        .catch(err => console.log(err));
    if (mylist.length > 0) {
        const { col, data } = toData(mylist);
        ({ th, tr } = toTable(req, col, data));
        var today = new Date();
        var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + '';
        var path = "./reports/" + date.toString() + ".pdf"

        res.render('reportTemplate', { pageTitle: 'Daily Report', thead: th, tbody: tr, layout: false },
            function (err, result) {
                pdf.create(result, options).toFile(path, function (err) {
                    if (err) {
                        console.log(err)
                        req.flash('error', 'Error generating report!');
                    }
                    res.download(path, 'daily_report.pdf')
                })
            });
    } else {
        req.flash('error', 'Empty record today!');
        res.redirect('/generate-report');
    }

}

exports.getWeeklyReport = async (req, res) => {

    var mylist;
    var { th, tr } = {};
    whereCondition = { checkInDateTime: sequelize.where(sequelize.fn('week', sequelize.col('Attendance.checkInDateTime')), '=', sequelize.fn('week', sequelize.fn('now'))), };
    const condition = {
        where: whereCondition, include: { model: Student, attributes: [['StudentName', 'Student Name'],] }, raw: true, nest: true, required: true, order: [
            ['checkInDateTime', 'DESC'],
        ], attributes: [['recordID', 'No'], ['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID'],]
    };

    await Attendance.findAll(condition)
        .then(list => {
            mylist = list;
        })
        .catch(err => console.log(err));
    if (mylist.length > 0) {
        const { col, data } = toData(mylist);
        ({ th, tr } = toTable(req, col, data));
        var today = new Date();
        var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + '';
        var path = "./reports/" + date.toString() + ".pdf"

        res.render('reportTemplate', { pageTitle: 'Weekly Report', thead: th, tbody: tr, layout: false },
            function (err, result) {
                pdf.create(result, options).toFile(path, function (err) {
                    if (err) {
                        console.log(err)
                        req.flash('error', 'Error generating report!');
                    }
                    res.download(path, 'weekly.pdf')
                })
            });
    } else {
        req.flash('error', 'Empty record this week!');
        res.redirect('/generate-report');
    }

}

exports.getMonthlyReport = async (req, res) => {

    var mylist;
    var { th, tr } = {};
    whereCondition = { checkInDateTime: sequelize.where(sequelize.fn('month', sequelize.col('Attendance.checkInDateTime')), '=', sequelize.fn('month', sequelize.fn('now'))), };
    const condition = {
        where: whereCondition, include: { model: Student, attributes: [['StudentName', 'Student Name'],] }, raw: true, nest: true, required: true, order: [
            ['checkInDateTime', 'DESC'],
        ], attributes: [['recordID', 'No'], ['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID'],]
    };

    await Attendance.findAll(condition)
        .then(list => {
            mylist = list;
        })
        .catch(err => console.log(err));
    if (mylist.length > 0) {
        const { col, data } = toData(mylist);
        ({ th, tr } = toTable(req, col, data));
        var today = new Date();
        var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + '';
        var path = "./reports/" + date.toString() + ".pdf"

        res.render('reportTemplate', { pageTitle: 'Monthly Report', thead: th, tbody: tr, layout: false },
            function (err, result) {
                pdf.create(result, options).toFile(path, function (err) {
                    if (err) {
                        console.log(err)
                        req.flash('error', 'Error generating report!');
                    }
                    res.download(path, 'monthly_report.pdf')
                })
            });
    } else {
        req.flash('error', 'Empty record this month!');
        res.redirect('/generate-report');
    }
}

exports.generateReport = async (req, res) => {
    var mylist;
    var pageTitle = '';
    var fileName = '';
    var { th, tr } = {};
    if (req.url == '/monthly-report') {
        whereCondition = { checkInDateTime: sequelize.where(sequelize.fn('month', sequelize.col('Attendance.checkInDateTime')), '=', sequelize.fn('month', sequelize.fn('now'))), };
        pageTitle = 'Monthly report';
        fileName = 'Monthly_Report.pdf';
    }
    else if (req.url == '/weekly-report') {
        whereCondition = { checkInDateTime: sequelize.where(sequelize.fn('week', sequelize.col('Attendance.checkInDateTime')), '=', sequelize.fn('week', sequelize.fn('now'))), };
        pageTitle = 'Weekly report';
        fileName = 'Weekly_Report.pdf';
    }
    else if (req.url == '/daily-report') {
        whereCondition = { checkInDateTime: sequelize.where(sequelize.fn('DATE', sequelize.col('Attendance.checkInDateTime')), sequelize.fn('curdate')), };
        pageTitle = 'Daily report';
        fileName = 'Daily_Report.pdf';
    }
    else {
        whereCondition = {};
    }
    const condition = {
        where: whereCondition, include: { model: Student, attributes: [['StudentName', 'Student Name'], ['StudentClass', 'Student Class']] }, raw: true, nest: true, required: true, order: [
            ['checkInDateTime', 'DESC'],
        ], attributes: [['recordID', 'No'], [sequelize.fn("DATE_FORMAT", sequelize.col('Attendance.checkInDateTime'), "%Y-%m-%e %H:%i:%s"), 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID'],]
    };

    await Attendance.findAll(condition)
        .then(list => {
            mylist = list;
        })
        .catch(err => console.log(err));
    if (mylist.length > 0) {
        const { col, data } = toData(mylist);
        ({ th, tr } = toTable(req, col, data));
        var today = new Date();
        var date = today.getFullYear() + (today.getMonth() + 1) + today.getDate() + '';
        var path = "./reports/" + date.toString() + ".pdf"

        res.render('reportTemplate', { pageTitle: pageTitle, thead: th, tbody: tr, layout: false },
            function (err, result) {
                pdf.create(result, options).toFile(path, function (err) {
                    if (err) {
                        console.log(err)
                        req.flash('error', 'Error generating report!');
                    }
                    res.download(path, fileName);
                })
            });
    } else {
        req.flash('error', 'Empty record!');
        res.redirect('/generate-report');
    }

}

function toData(mylist) {
    var col = [];//get thead
    var arr = [];// get td
    const data = [];// array of thead and td elements

    for (var i = 0; i < mylist.length; i++) { //loop through the len of records
        for (var key in mylist[i]) {// loop through the no of columns in mylist[i]
            var size = Object.keys(mylist[i][key]).length;
            if (size > 0) {// if there are JOIN tables or to store DATE string val
                if (typeof (mylist[i][key]) === 'string') {// for DATE string val
                    arr.push(mylist[i][key]);
                }
                else {
                    for (var a in mylist[i][key]) {
                        if (a.includes("Student")) {
                            arr.push(mylist[i][key][a]);// store the JOIN table data
                        }
                    }
                }
            } else {
                arr.push(mylist[i][key]);// store the records data
            }
        }
        data.push(arr);
        arr = [];
    }

    for (var key in mylist[0]) {// loop through the no of columns in mylist[0]
        if (col.indexOf(key) === -1) {
            if (key == 'Student' && size > 0) {// if there are JOIN tables
                for (var a in mylist[0][key]) {
                    if (a.includes("Student") && col.indexOf(mylist[0][key][a]) === -1) { //find Student Name 
                        col.push(a);// store the column name
                    }
                }
            } else
                col.push(key);// store the column name
        }
    }
    return { col, data };
}

function toTable(req, col, data) {

    var thStart = '<th scope="col" style="border: 1px solid black;">';
    var thEnd = '</th> ';
    var th = "";
    for (var i = 0; i < col.length; i++) {
        th += thStart + col[i] + thEnd;
    } // concat the thead

    var tdStart = '<td style="border: 1px solid black;">'
    var tdEnd = '</td>'
    var trStart = '<tr>'
    var trEnd = '</tr>'
    var tr = "";
    for (var i = 0; i < data.length; i++) {
        var td = "";
        for (var j = 0; j < data[i].length; j++) {
            td += tdStart + data[i][j] + tdEnd;
        }
        tr += trStart + td + trEnd;
    }// concat the td

    return { th, tr };
}