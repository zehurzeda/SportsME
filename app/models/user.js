var mongoose = require('mongoose');

module.exports = function() {
    var schema = mongoose.Schema({
        username: String,
        password: String,
        email: {
            type: String,
            index: {
                unique: true
            }
        },
        gender: String,
        sport: String,
        position: String

    });
    return mongoose.model('Usuario', schema);
}