const check = require('../middlewares/loginCheck')
const User = require('../models/LoginUser');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Attendance = require('../models/Attendance');
const sequelize = require('../../config/database');
const LoginUser = require('../models/LoginUser');
const pdf = require('html-pdf');
var options = {
    "format": 'A4',
    "border": {
        "top": "20px",
        "bottom": "25px"
    },
    "orientation": "landscape"
};
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

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

function merge(obj1, obj2) {
    var obj = {};

    for (var x in obj1)
        if (obj1.hasOwnProperty(x))
            obj[x] = obj1[x];

    for (var x in obj2)
        if (obj2.hasOwnProperty(x))
            obj[x] = obj2[x];

    return obj;
}

async function getHighTemp(req) {
    var mylist;
    var condition = {}
    whereCondition = {};
    var { th, tr } = {};
    includeCondition = {};
    whereCondition = { tempReading: { [Op.gte]: 37.50, }, checkInDateTime: sequelize.where(sequelize.fn('DATE', sequelize.col('Attendance.checkInDateTime')), sequelize.fn('curdate')), }; // WHERE tempReading >=37.50 AND DATE(checkInDateTime)= CURDATE()
    conditionDefault = { where: whereCondition, raw: true, nest: true, attributes: [['recordID', 'Record ID'], ['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['RFIDcode', 'RFID Code'], ['StudentID', 'Student ID']], };
    if (req.session.isParent) {
        includeCondition = {
            include: [
                {
                    required: true,
                    model: Student,
                    include:
                    {
                        required: true,
                        model: Parent,
                        include:
                        {
                            model: User,
                            where: { id: req.session.user.id }
                        }
                    }
                },
            ]
        }
        conditionDefault = { where: whereCondition, raw: true, nest: true, attributes: [['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID']], };
    }

    if (includeCondition) {
        condition = merge(conditionDefault, includeCondition)
    }
    else {
        condition = conditionDefault;
    }

    await Attendance.findAll(condition)
        .then(list => {
            mylist = list;
        })
        .catch(err => console.log(err));
    if (mylist.length > 0) {
        const { col, data } = toData(mylist);
        ({ th, tr } = toTable(req, col, data));
    } else {
        if (req.session.role === 'parent') {
            req.flash('info', "<h3><small class=\"text-muted\">Great! Your kid(s) body temperature is OK!!</small></h3>");
        } else
            req.flash('info', "<h3><small class=\"text-muted\">Great! No student is having high temperature!!</small></h3>");
    }
    return { th, tr };
};

exports.Homepage = async (req, res, next) => {
    if (res.locals.isAuthenticated) {
        var name = req.session.user.fullName;
        /* await check.checkStatus(req, res, next); // check the user's default password */
        console.log(req.session)

        if (req.session.isAdmin) {
            const { th, tr } = await getHighTemp(req);
            res.render('AdminHome', { pageTitle: 'Homepage', admin: true, displayName: name, infoMessage: infoMsg(req), thead: th, tbody: tr });
        }
        else if (req.session.isTeacher) {
            const { th, tr } = await getHighTemp(req);
            res.render('TeacherHome', { pageTitle: 'Homepage', teacher: true, displayName: name, infoMessage: infoMsg(req), thead: th, tbody: tr });
        }
        else if (req.session.isParent) {
            const { th, tr } = await getHighTemp(req);
            res.render('ParentHome', { pageTitle: 'Homepage', parent: true, displayName: name, infoMessage: infoMsg(req), thead: th, tbody: tr });
        }
    } else {
        res.redirect('/login');
    }
}

function toData(mylist) {
    var col = [];//get thead
    var arr = [];// get td
    const data = [];// array of thead and td elements

    for (var i = 0; i < mylist.length; i++) { //loop through the len of records
        for (var key in mylist[i]) {// loop through the no of columns in mylist[i]
            var size = Object.keys(mylist[i][key]).length;
            if (size > 0) {// if there are JOIN tables
                for (var a in mylist[i][key]) {
                    if (a.includes("Student")) {
                        arr.push(mylist[i][key][a]);// store the JOIN table data
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
    var thStart = '<th scope="col">'
    var thEnd = '</th> ';
    var th = "";
    for (var i = 0; i < col.length; i++) {
        th += thStart + col[i] + thEnd;
    } // concat the thead

    var tdStart = '<td>'
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

exports.viewAttn = async (req, res, next) => {
    var mylist;
    if (req.session.isParent) {
        includeCondition = {
            required: true,
            model: Student,
            attributes: { exclude: ['StudentEmail', 'RFIDcode', 'createdAt', 'updatedAt'] },
            attributes: [['StudentName', 'Student Name'],['StudentClass', 'Student Class']],
            include:
            {
                required: true,
                model: Parent,
                attributes: { exclude: ['ParentID','ParentEmail', 'ParentName', 'createdAt', 'updatedAt'] },
                include:
                {
                    model: User,
                    attributes: ['id'],
                    where: { id: req.session.user.id }
                }
            }
        }
        await Attendance.findAll({
            include: includeCondition, raw: true, nest: true, order: [
                ['recordID', 'DESC'],
                ['checkInDateTime', 'DESC'],
            ], attributes: [['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID']]
        })
            .then(list => {
                mylist = list;
            })
            .catch(err => console.log(err));
        const { col, data } = toData(mylist);
        const { th, tr } = toTable(req, col, data);

        res.render('parentView', { pageTitle: 'View Child Attendance', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req), thead: th, tbody: tr });
    }
    else if (req.session.isTeacher) {

        await Attendance.findAll({
            include: { model: Student, attributes: [['StudentName', 'Student Name'],['StudentClass', 'Student Class']] }, raw: true, nest: true, order: [
                ['recordID', 'DESC'],
                ['checkInDateTime', 'DESC'],
            ], attributes: [['recordID', 'No'], ['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID'],]
        })
            .then(list => {
                mylist = list;
            })
            .catch(err => console.log(err));
        const { col, data } = toData(mylist);
        const { th, tr } = toTable(req, col, data);
        res.render('teacherView', { pageTitle: 'View All Attendance Records', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req), thead: th, tbody: tr });
    }
    else res.redirect('/');
}

exports.viewAttnTeacherSearch = async (req, res) => {
    let date = req.query.datePicker;
    let name = req.query.studentName;
    let id = req.query.studentID;
    let stdclass = req.query.studentClass;

    var whereCondition1, whereCondition2, whereCondition3, whereCondition4 = {};
    var includeCondition1, includeCondition2, includeCondition3 = {};

    if (date) {
        whereCondition1 = {
            checkInDateTime: sequelize.where(sequelize.fn('DATE', sequelize.col('Attendance.checkInDateTime')), date)
        };
    }
    if (name) {
        includeCondition1 = {
            StudentName: name
        };
    }
    if (id) {
        whereCondition3 = {
            StudentID: sequelize.where(sequelize.col('Student.StudentID'), id),
        };
        includeCondition2 = {
            StudentID: id
        }
    }
    if (stdclass) {
        includeCondition3 = {
            StudentClass: stdclass
        }
    }

    const whereCondition = merge(whereCondition1, whereCondition2, whereCondition3, whereCondition4);
    const includeCondition = merge(includeCondition1, includeCondition2, includeCondition3);
    var mylist;

    await Attendance.findAll({
        where: whereCondition, include: {required: true, model: Student, where: includeCondition, attributes: [['StudentName', 'Student Name']]}, raw: true, nest: true, order: [
            ['recordID', 'DESC'],
            ['checkInDateTime', 'DESC'],
        ], attributes: [['recordID', 'No'], ['checkInDateTime', 'Attendance Check In Time'], ['tempReading', 'Temperature'], ['StudentID', 'Student ID'],]
    })
        .then(list => {
            if (list.length > 0) {
                console.log(list);
                mylist = list;
                req.session.beforeName = name;
                req.session.beforeID = id;
                req.session.beforedate = date;
                req.session.beforeclass = stdclass;
                req.flash('oldInput', { studentName: name, studentID: id, studentClass: stdclass, datePicker: date });
                const { col, data } = toData(mylist);
                const { th, tr } = toTable(req, col, data);
                res.render('teacherView', { pageTitle: 'View All Attendance Records', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req), thead: th, tbody: tr });
            } else {
                req.flash('error', 'Student is not found');
                res.redirect('/view');
            }
        })
        .catch(err => { console.log(err) });
}