exports.checkRoles = async (req, res, next) => {
    console.log(req.session.role);

    if (res.locals.isAuthenticated) {
        if (req.session.role === 'admin') {
            res.render('AdminHome', { pageTitle: 'Homepage', admin: true });
        }
        else if (req.session.role === 'teacher') {
            res.render('TeacherHome', { pageTitle: 'Homepage', teacher: true });
        }
        else if (req.session.role === 'parent') {
            res.render('ParentHome', { pageTitle: 'Homepage', parent: true });
        }
    } else {
        res.redirect('/login');
    }

}