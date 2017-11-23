var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../app/models/user')
var bCrypt = require('bcrypt-nodejs')

module.exports = function() {
    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            findOrCreateUser = function() {
                // Busca usuário pelo nome apresentado
                User.findOne({ 'username': username }, function(err, user) {
                    // Em caso de erro, retornar
                    if (err) {
                        console.log('Erro no Registro: ' + err);
                        return done(err);
                    }
                    // Usuário existe
                    if (user) {
                        console.log('Usuário já existe');
                        return done(null, false,
                            req.flash('message', 'Usuário já existe'));
                    } else {
                        // Se não houver usuário com aquele e-mail
                        // criaremos o novo usuário
                        var newUser = new User();
                        // Atribuindo as credenciais locais
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        // salva o usuário
                        newUser.save(function(err) {
                            if (err) {
                                console.log('Erro ao salvar usuário: ' + err);
                                throw err;
                            }
                            console.log('Registro de usuário com sucesso');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Atrasa a execução do método findOrCreateUser e o executa
            // na próxima oportunidade dentro do loop de eventos
            process.nextTick(findOrCreateUser);
        }));



    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            // verifica no mongo se o nome de usuário existe ou não
            User.findOne({ 'username': username },
                function(err, user) {
                    // Em caso de erro, retorne usando o método done
                    if (err)
                        return done(err);
                    // Nome de usuário não existe, logar o erro & redirecione de volta
                    if (!user) {
                        console.log('Usuário não encontrado para usuário ' + username);
                        return done(null, false,
                            req.flash('message', 'Usuário não encontrado.'));
                    }
                    // Usuário existe mas a senha está errada, logar o erro
                    if (!isValidPassword(user, password)) {
                        console.log('Senha Inválida');
                        return done(null, false,
                            req.flash('message', 'Senha Inválida'));
                    }
                    // Tanto usuário e senha estão corretos, retorna usuário através 
                    // do método done, e, agora, será considerado um sucesso
                    return done(null, user);
                }
            );
        }));



    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

    // Gera hash usando bCrypt
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};