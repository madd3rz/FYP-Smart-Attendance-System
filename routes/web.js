const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');// load and check auth in homepage
const AuthController = require('../app/controllers/AuthController');// auth related controller

router.get('/',HomeController.Homepage);
router.get('/view', HomeController.viewAttn);
router.get('/view-search-filter', HomeController.viewAttnTeacherSearch);

router.get('/manage', HomeController.manageStudentParent);
router.get('/add-student', HomeController.addStudent);
router.post('/add-student', HomeController.addStudentPOST);
router.get('/add-parent', HomeController.addParent);
router.post('/add-parent', HomeController.addParentPOST);

router.get('/edit-student', HomeController.editStudent);
router.get('/edit-search-student', HomeController.editStudentSearch);
router.post('/edit-student', HomeController.editStudentPOST);

router.get('/edit-parent', HomeController.editParent); 
router.get('/edit-search-parent', HomeController.editParentSearch);
router.post('/edit-parent', HomeController.editParentPOST);

router.get('/generate-report', HomeController.generateReport);
router.get('/fetch-report', HomeController.fetchReport);

router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/sign-up', AuthController.signUpPage);
router.post('/sign-up', AuthController.signUp);
router.get('/forgot-password', AuthController.forgotPasswordPage);
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router;