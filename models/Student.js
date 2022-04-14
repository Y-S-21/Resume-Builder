const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const studentSchema = new mongoose.Schema({
    student: String,
    password: String
});

studentSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('student', studentSchema);