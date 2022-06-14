const User = require('../models/LoginUser');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');

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

exports.manageStudentParent = async (req, res) => {
    res.render('manageUser', { pageTitle: 'Manage Student and Parent List' });
}

async function toSelection(mylist) {

    var opVal = '<option value="'
    var opValEnd = '">'
    var opEnd = '</option> ';
    var option = "";
    for (var i = 0; i < mylist.length; i++) {
        option += opVal + mylist[i]['ParentName'] + opValEnd + mylist[i]['ParentName'] + opEnd;
    }
    console.log(option);

    return option;
}

exports.addStudent = async (req, res) => {
    var mylist;

    await Parent.findAll({
        attributes: ['ParentName'],
        order: [
            ['ParentName', 'ASC'],
        ],
    })
        .then(Parent => {
            mylist = Parent;
        }).catch(err => { console.log(err) })
    const result = await toSelection(mylist);

    res.render('addStudent', { pageTitle: 'Add New Student', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req), selection: result });
}

exports.addStudentPOST = async (req, res) => {
    var ParentID;
    await Parent.findOne({
        where: {
            ParentName: req.body.parentName,
        }
    })
        .then(parent => {
            if (!parent) {
                req.flash('error', 'No parent name found in database');
                req.flash('oldInput', { studentName: req.body.studentName })
                return res.redirect('/add-student');
            }
            ParentID = parent.ParentID;

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
                            ParentID: ParentID
                        });
                        user.save();
                        req.flash('info', 'Successfully add new student');
                    } else {
                        req.flash('error', 'Student exists already, please enter a different student.');
                        req.flash('oldInput', { name: req.body.studentName, class: req.body.studentClass, rfid: req.body.RFIDcode, studentid: req.body.studentID });
                    }
                    return res.redirect('/add-student');
                })
                .catch(err => console.log(err));
        })
}

exports.addParent = async (req, res) => {
    res.render('addParent', { pageTitle: 'Add New Parent', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req) });
}

exports.addParentPOST = async (req, res) => {
    Parent.findOne({
        where: {
            ParentName: req.body.parentName,
            ParentEmail: req.body.parentEmail,
        }
    })
        .then(async (user) => {
            if (!user) {
                bcrypt
                    .hash("abc123", 12)
                    .then(async (hashedPassword) => {
                        const user = new User({
                            fullName: req.body.parentName,
                            email: req.body.parentEmail,
                            password: hashedPassword,
                        });
                        await user.save();
                    })
                    .then(() => {
                        User.findOne({ where: { email: req.body.parentEmail, } }).then(user => {
                            console.log(user)
                            const parent = new Parent({
                                ParentName: req.body.parentName,
                                ParentEmail: req.body.parentEmail,
                                userId: user.id,
                            })
                            parent.save();
                            req.flash('info', 'Successfully add new parent');
                            return res.redirect('/add-parent');
                        }).catch(err => { console.log(err) });
                    })
                    .catch(err => { console.log(err) })
            } else {
                req.flash('error', 'Parent already exists in database');
                req.flash('oldInput', { name: req.body.parentName, email: req.body.parentEmail });
                return res.redirect('/add-parent');
            }
        })
        .catch(err => { console.log(err) });
}

exports.editStudent = async (req, res) => {
    res.render('editStudent', { pageTitle: 'Edit Student Details', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req) });
}

exports.editStudentSearch = async (req, res) => {
    let id = parseInt(req.query.searchStudentID, 10);
    let name = req.query.searchStudentName;

    var data = [id, name];

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

    var parentID;
    await Student.findOne({ where: whereCondition })
        .then(user => {
            if (user) {
                parentID = user.ParentID;
            }
        })

    includeCondition = {
        required: true,
        model: Parent,
        attributes: [['ParentName', 'ParentName'],],
        where: { ParentID: parentID }
    }

    Student.findOne({ where: whereCondition, include: includeCondition, raw: true, nest: true, })
        .then(user => {
            if (user) {
                req.session.beforeName = user.StudentName;
                req.session.beforeID = user.StudentID;
                req.session.beforeCode = user.RFIDcode;
                req.flash('oldInput', { name: user.StudentName, class: user.StudentClass, parentName: user.Parent.ParentName, StudentID: user.StudentID, RFIDcode: user.RFIDcode });
            } else {
                req.flash('error', 'Student is not found');
            }
            return res.redirect('/edit-student');
        })
        .catch(err => { console.log(err) });
}

exports.editStudentPOST = async (req, res) => {
    Student.findOne({
        where: {
            StudentID: req.session.beforeID,
            StudentName: req.session.beforeName,
            RFIDcode: req.session.beforeCode,
        }
    })
        .then(user => {
            if (user) {
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

exports.editParent = async (req, res) => {
    res.render('editParent', { pageTitle: 'Edit Parent Details', errorMessage: errMsg(req), oldInput: oldInput(req), infoMessage: infoMsg(req) });
}

exports.editParentSearch = async (req, res) => {
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

exports.editParentPOST = async (req, res) => {
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