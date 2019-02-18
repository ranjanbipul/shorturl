var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({ 
    name: String, 
    username: { type: String, lowercase: true, index:{unique: true} },
    password: String, 
    admin: Boolean 
}));