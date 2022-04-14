const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const facultySchema = new mongoose.Schema({
    faculty: String,
    password: String
});

facultySchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('faculty', facultySchema);