const mongoose  = require('mongoose');

const userVerificationSchema = mongoose.Schema({
    userId : String,
    otp : String,
    createdAt : Date,
    expireAt : Date
})

const userVerified = mongoose.model ( 'userverification', userVerificationSchema);
module.exports = userVerified;