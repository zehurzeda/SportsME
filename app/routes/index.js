var passport = require('passport');

module.exports = function(app) {

    var isAuthenticated = function(req, res, next) {
            if (req.isAuthenticated())
                return next();
            res.redirect('/');
        }
        /* GET Home Page */
    app.route('/home')
        .get(isAuthenticated, function(req, res) {
            res.render('home', { user: req.user });
        });

    // Assim como qualquer middleware, é quintessencial chamarmos next()
    // Se o usuário estiver autenticado


    /* Requisição GET para página de LOGIN. */
    app.route('/')
        .get(function(req, res) {
            // Mostra a página de Login com qualquer mensagem flash, caso exista
            res.render('index', { message: req.flash('message') });
        });

    /* Requisição POST para LOGIN */
    app.route('/login')
        .post(passport.authenticate('login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }));

    /*Requisição GET para página de Registro */
    app.route('/signup')
        .get(function(req, res) {
            res.render('signup');
        })
        .post(passport.authenticate('signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }));

    app.route('/signout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
}