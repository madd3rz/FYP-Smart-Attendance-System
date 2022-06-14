const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const User = require('../models/LoginUser');
const bcrypt = require('bcryptjs');

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

async function checkStatus (req, res, next){
    var pass = await bcrypt.hash("testuser123", 12);
    console.log(req.body.inputPassword)
    await bcrypt
        .compare(req.body.inputPassword, pass)
        .then(doMatch => {
            if (doMatch) {
                console.log("default pass detected");
                req.session.resetPassword = true;
            }
            console.log(req.session.resetPassword)
        }).catch(err => { console.log(err) });
}
