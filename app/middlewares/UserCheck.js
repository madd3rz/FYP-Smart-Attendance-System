const User = require('../models/LoginUser');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

exports.checkUsr = async (req, res, next) => {
    console.log(req.body.inputEmail);
    await Admin.findOne({
        where: { AdminEmail: req.body.inputEmail }
    }).then((user) => {
        if (user) {
            req.session.role = "admin";
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
            req.session.role = "teacher";
        }
        else {
            console.log('not teacher')
            return false;
        }
    })
        .catch(err => console.log(err));

    await Parent.findOne({
        where: { ParentEmail: req.body.inputEmail }
    }).then((user) => {
        if (user) {
            req.session.role = "parent";
        }
        else {
            return false;
        }
    })
        .catch(err => console.log(err));

};
