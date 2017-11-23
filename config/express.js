var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');

module.exports = function() {
    var app = express();

    app.set('port', 3000);

    app.use(express.static('./public'));
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    // novos middlewares
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(require('method-override')());
    //login
    app.use(expressSession({ secret: 'minhaChaveSecreta' }));
    app.use(passport.initialize());
    app.use(passport.session());

    load('models', { cwd: 'app' })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};