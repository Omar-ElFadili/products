const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userVerificationSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User",
        unique : true
    },
    token : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 3600 // one hour
    },
    
})

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

module.exports = UserVerification;