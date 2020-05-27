const mongoose = require('mongoose');

const bcrypt = require('bcrypt-nodejs');
const companyNames = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    city:{type: String, default:''},
    passcode:{type: String, unique: true, default:''},
    image: {type: String, default: 'default.png'}
});
companyNames.methods.encryptPasscode = function(passcode){
    return bcrypt.hashSync(passcode, bcrypt.genSaltSync(10), null);
};
companyNames.methods.validUserPasscode = function(passcode){
    return bcrypt.compareSync(passcode, this.passcode);
}
module.exports = mongoose.model('Company', companyNames);