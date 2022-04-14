const mongoose = require('mongoose');
// const session = require('express-session');
// const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = new mongoose.Schema({
    admin: String,
    password: String
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('admin', adminSchema);