const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');// load and check auth in homepage
const AuthController = require('../app/controllers/AuthController');// auth related controller
const TeacherController = require('../app/controllers/TeacherController'); // teacher related controller
const AdminController = require('../app/controllers/AdminController'); // admin related controller

router.get('/',HomeController.Homepage);
router.get('/view', HomeController.viewAttn);
router.get('/view-search-filter', HomeController.viewAttnTeacherSearch);

router.get('/manage', AdminController.manageStudentParent);
router.get('/add-student', AdminController.addStudent);
router.post('/add-student', AdminController.addStudentPOST);
router.get('/add-parent', AdminController.addParent);
router.post('/add-parent', AdminController.addParentPOST);
router.get('/edit-student', AdminController.editStudent);
router.get('/edit-search-student', AdminController.editStudentSearch);
router.post('/edit-student', AdminController.editStudentPOST);
router.get('/edit-parent', AdminController.editParent); 
router.get('/edit-search-parent', AdminController.editParentSearch);
router.post('/edit-parent', AdminController.editParentPOST);

router.get('/generate-report', TeacherController.generateReportPage);
router.get('/daily-report', TeacherController.generateReport);
router.get('/weekly-report', TeacherController.generateReport);
router.get('/monthly-report', TeacherController.generateReport);

router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/sign-up', AuthController.signUpPage);
router.post('/sign-up', AuthController.signUp);
router.get('/forgot-password', AuthController.forgotPasswordPage);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/reset-password', AuthController.resetPasswordPage);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;