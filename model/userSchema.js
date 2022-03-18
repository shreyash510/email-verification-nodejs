const mongoose  = require('mongoose');

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    pass : String,
    verified : Boolean
})

const user = mongoose.model ( 'user', userSchema);
module.exports = user;