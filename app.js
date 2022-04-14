const express = require('express');
const router = require('./Routes/User');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect('mongodb://localhost:27017/resumeDB', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.wxaut.mongodb.net/resumeDB', {useNewUrlParser: true});
const con = mongoose.connection;
con.on('open', () =>{console.log('DB connected');});

app.use(router);
app.set('views', 'views');


app.listen(3000, () => {console.log("server at 3000");});