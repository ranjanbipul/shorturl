var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Redirect', new Schema({ 
    user: Schema.Types.ObjectId,
    shortId: {type:String,index:{unique: true}},
    originalUrl: String,
    hits: {type: Number,default: 0},
    createdAt: {type:Date,default: Date.now()}
}));