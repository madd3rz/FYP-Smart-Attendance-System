const User = require('../models/LoginUser');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Attendance = require('../models/Attendance');
const sequelize = require('../../config/database');
const join = require('locutus/php/strings/join');
const LoginUser = require('../models/LoginUser');
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
    if (req.session.role === 'parent') {
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

    }
    const conditionDefault = { where: whereCondition, raw: true, nest: true, };
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
        ({ th, tr } = toTable(mylist));
    } else {
        if (req.session.role === 'parent') {
            req.flash('info', "<h3><small class=\"text-muted\">Great! Your kid(s) body temperature is OK!!</small></h3>");
        }else
        req.flash('info', "<h3><small class=\"text-muted\">Great! No student is having high temperature!!</small></h3>");
    }
    return { th, tr };
};

exports.Homepage = async (req, res, next) => {
    if (res.locals.isAuthenticated) {
        var name = req.session.user.fullName;

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

function toTable(mylist) {
    var col = [];//get thead
    var arr = [];// get td
    const data = [];// array of thead and td elements

    for (var i = 0; i < mylist.length; i++) { //loop through the len of records
        for (var key in mylist[i]) {// loop through the no of columns in mylist[i]
            var size = Object.keys(mylist[i][key]).length;
            if (size > 0) {// if there are JOIN tables
                for (var a in mylist[i][key]) {
                    if (a.includes("Name")) {
                        arr.push(mylist[i][key][a]);// store the JOIN table data
                    }
                }
            } else {
                arr.push(mylist[i][key]);// store the records data
            }

            if (col.indexOf(key) === -1) {
                col.push(key);// store the column name
            }
        }
        data.push(arr);
        arr = [];
    }

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
        res.render('parentView', { pageTitle: 'View Child Attendance' });
    }
    else if (req.session.isTeacher) {

        await Attendance.findAll({ include: { model: Student }, raw: true, nest: true })
            .then(list => {
                mylist = list;
            })
            .catch(err => console.log(err));
        const { th, tr } = toTable(mylist);
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
            StudentClass: stdclass,
        }
    }

    const whereCondition = merge(whereCondition1, whereCondition2, whereCondition3, whereCondition4);
    const includeCondition = merge(includeCondition1, includeCondition2, includeCondition3);
    var mylist;

    await Attendance.findAll({ where: whereCondition, include: { model: Student, where: includeCondition }, raw: true, nest: true })
        .then(list => {
            if (list.length > 0) {
                mylist = list;
                req.session.beforeName = name;
                req.session.beforeID = id;
                req.session.beforedate = date;
                req.session.beforeclass = stdclass;
                req.flash('oldInput', { studentName: name, studentID: id, studentClass: stdclass, datePicker: date });
                const { th, tr } = toTable(mylist);
                res.render('teacherView', { pageTitle: 'View All Attendance Records', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req), thead: th, tbody: tr });
            } else {
                req.flash('error', 'Student is not found');
                res.redirect('/view');
            }
        })
        .catch(err => { console.log(err) });
}

exports.manageStudentParent = async (req, res, next) => {
    res.render('manageUser', { pageTitle: 'Manage Student and Parent List' });
}

exports.addStudent = async (req, res, next) => {
    res.render('addStudent', { pageTitle: 'Add New Student', errorMessage: errMsg(req), oldInput: oldInput(req) });
}

exports.addStudentPOST = async (req, res, next) => {
    Student.findOne({
        where: {
            StudentName: req.body.studentName,
            StudentID: req.body.studentID
        }
    })
        .then(user => {
            if (!user) {
                const user = new Student({
                    StudentName: req.body.studentName,
                    StudentID: req.body.studentID,
                    StudentClass: req.body.studentClass,
                    RFIDcode: req.body.RFIDcode,
                });
                return user.save();
            } else {
                req.flash('error', 'Student exists already, please enter a different student.');
                req.flash('oldInput', { name: req.body.studentName });
                return res.redirect('/add-student');
            }
        })
        .catch(err => console.log(err));
}

exports.addParent = async (req, res, next) => {
    res.render('addParent', { pageTitle: 'Add New Parent', errorMessage: errMsg(req), oldInput: oldInput(req) });
}

exports.addParentPOST = async (req, res, next) => {
    Parent.findOne({
        where: {
            ParentName: req.body.parentName,
            ParentEmail: req.body.parentEmail,
        }
    })
        .then(user => {
            if (!user) {
                const user = new Parent({
                    ParentName: req.body.parentName,
                    ParentEmail: req.body.parentEmail,
                });

                bcrypt
                    .hash("testuser123", 12)
                    .then(hashedPassword => {
                        const user = new User({
                            fullName: "johndoe",
                            email: req.body.parentEmail,
                            password: hashedPassword,
                        });
                        return user.save();
                    })
                return user.save();
            } else {
                req.flash('error', 'Parent already exists in database');
                req.flash('oldInput', { name: req.body.parentName, email: req.body.parentEmail });
                return res.redirect('/add-parent');
            }
        })
        .catch(err => { console.log(err) });
}

exports.editStudent = async (req, res, next) => {
    res.render('editStudent', { pageTitle: 'Edit Student Details', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req) });
}

exports.editStudentSearch = async (req, res, next) => {
    let id = parseInt(req.query.searchStudentID, 10);
    let name = req.query.searchStudentName;

    var data = [id, name];
    console.log(data);

    var whereCondition = {};

    if (!id && name == "") {
        console.log('no input');
        req.flash('error', 'No input found');
        return res.redirect('/edit-student');
    }
    else if (name == "" && id) {
        console.log('no name provided');
        whereCondition = {
            StudentID: id
        };
    }
    else if (!id && name != "") {
        console.log('no id provided');
        whereCondition = {
            StudentName: name
        };
    }
    else if (id && name) {
        console.log('all')
        whereCondition['$and'] = data.map(function (name) {
            return {
                StudentID: id,
                StudentName: name
            };
        })
    }
    console.log(whereCondition);
    Student.findOne({ where: whereCondition })
        .then(user => {
            if (user) {
                console.log(user);
                req.session.beforeName = user.StudentName;
                req.session.beforeID = user.StudentID;
                req.session.beforeCode = user.RFIDcode;
                req.flash('oldInput', { name: user.StudentName, class: user.StudentClass, parentName: "John Doe", StudentID: user.StudentID, RFIDcode: user.RFIDcode });
            } else {
                req.flash('error', 'Student is not found');
            }
            return res.redirect('/edit-student');
        })
        .catch(err => { console.log(err) });
}

exports.editStudentPOST = async (req, res, next) => {
    Student.findOne({
        where: {
            StudentID: req.session.beforeID,
            StudentName: req.session.beforeName,
            RFIDcode: req.session.beforeCode,
        }
    })
        .then(user => {
            if (user) {
                console.log(user);
                console.log(req.body);
                user.update({
                    StudentID: req.body.studentID,
                    StudentName: req.body.studentName,
                    RFIDcode: req.body.RFIDcode,
                });
                req.flash('info', 'Successfully updated student details');
                user.save();
                return res.redirect('/edit-student');
            } else {
                req.flash('error', 'Failed to update student details');
                req.flash('oldInput', { name: req.body.studentName, class: req.body.studentClass, parentName: "John Doe", StudentID: req.body.studentID, RFIDcode: req.body.RFIDcode });
                return res.redirect('/edit-student');
            }
        })
}

exports.editParent = async (req, res, next) => {
    res.render('editParent', { pageTitle: 'Edit Parent Details', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req) });
}

exports.editParentSearch = async (req, res, next) => {
    Parent.findOne({
        where: {
            ParentName: req.query.searchParentName,
        }
    })
        .then(user => {
            if (user) {
                req.session.beforeName = user.dataValues.ParentName;
                req.session.beforeEmail = user.ParentEmail;
                req.flash('oldInput', { name: user.dataValues.ParentName, email: user.dataValues.ParentEmail });
            } else {
                req.flash('error', 'Parent name entered is not found');
            }
            return res.redirect('/edit-parent');
        })
        .catch(err => { console.log(err) });
}

exports.editParentPOST = async (req, res, next) => {
    Parent.findOne({
        where: {
            ParentName: req.session.beforeName,
            ParentEmail: req.session.beforeEmail,
        }
    })
        .then(user => {
            if (user) {
                console.log(user);
                user.update({
                    ParentName: req.body.parentName,
                    ParentEmail: req.body.parentEmail,
                });
                req.flash('info', 'Successfully updated parent details');
                user.save();
                return res.redirect('/edit-parent');
            } else {
                req.flash('error', 'Failed to update parent details');
                req.flash('oldInput', { name: req.body.parentName, email: req.body.parentEmail });
                return res.redirect('/edit-parent');
            }

        })
        .catch(err => { console.log(err) });
}

exports.generateReport = async (req, res, next) => {
    res.render('generate-report', { pageTitle: 'Generate Report' });
}

exports.fetchReport = async (req, res, next) => {
    next();
}