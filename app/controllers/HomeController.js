const User = require('../models/LoginUser');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

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

exports.Homepage = async (req, res, next) => {
    if (res.locals.isAuthenticated) {
        var name = req.session.user.fullName;

        if (req.session.role === 'admin') {
            res.render('AdminHome', { pageTitle: 'Homepage', admin: true, displayName: name });
        }
        else if (req.session.role === 'teacher') {
            res.render('TeacherHome', { pageTitle: 'Homepage', teacher: true, displayName: name });
        }
        else if (req.session.role === 'parent') {
            res.render('ParentHome', { pageTitle: 'Homepage', parent: true, displayName: name });
        }
    } else {
        res.redirect('/login');
    }
}

exports.viewAttn = async (req, res, next) => {
    console.log(req.session);
    if (req.session.role === 'parent') {
        res.render('parentView', { pageTitle: 'View Child Attendance' });
    }
    else if (req.session.role === 'teacher') {
        res.render('teacherView', { pageTitle: 'View All Attendance Records' });
    }
    else res.redirect('/');
}

/* exports.viewAttnTeacherSearch = async function(req, res, next) => {
    let date = req.query.datePicker;
    let name = req.query.StudentName;
    let id = req.query.StudentID;
    let stdclass = req.query.StudentClass;

    var data = [date, name, id, stdclass];
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
                req.session.beforeName = name;
                req.session.beforeID = id;
                req.flash('oldInput', { name: user.StudentName, class: user.StudentClass, parentName: "John Doe", StudentID: user.StudentID, RFIDcode: user.RFIDcode });
            } else {
                req.flash('error', 'Student is not found');
            }
            return res.redirect('/edit-student');
        })
        .catch(err => { console.log(err) });
} */

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
                    StudentEmail: "johndoe@example.com", //#TODO remove the default value
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
                req.flash('oldInput', { name: req.body.studentName, class: req.body.studentClass, parentName: "John Doe", StudentID: req.body.studentID, RFIDcode: req.body.RFIDcode});
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