const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

exports.checkUsr = async (req, res, next) => {
    await Admin.findOne({
        where: { AdminEmail: req.body.inputEmail }
    }).then((user) => {
        if (user) {
            req.session.isAdmin = true;
        }
        else {
            return false;
        }
    })
        .catch(err => console.log(err));

    await Teacher.findOne({
        where: { TeacherEmail: req.body.inputEmail }
    }).then((user) => {
        if (user) {
            req.session.isTeacher = true;
        }
        else {
            return false;
        }
    })
        .catch(err => console.log(err));

    await Parent.findOne({
        where: { ParentEmail: req.body.inputEmail }
    }).then((user) => {
        if (user) {
            req.session.isParent = true;
        }
        else {
            return false;
        }
    })
        .catch(err => console.log(err));

};

exports.checkStatus = async (req, res, next) => {

}
