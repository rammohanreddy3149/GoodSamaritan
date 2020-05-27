const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = mongoose.Schema({
    username: {type:String,unique: true},
    fullname: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    password: {type: String, unique: true, default: ''},
    type: {type: String, default:'Personal'},
    userImage: {type: String, default: 'default.png'},
    designation: {type: String, default: ''},
    superior: {type: String, default: ''},
    department: {type: String, default: ''},
    samaritan_coins:{type:Number,default:100},
    sentRequests: [{
        username: {type: String, default: ''}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
        friendName: {type: String, default: ''}
    }],
    totalRequest: {type:Number,default: 0},
    gender: {type: String, default: ''},
    section: {type: String, default: ''},
    bio: {type: String, default: ''},
    //googleTokens: {type: String, default: ''}
});
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};
userSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema);