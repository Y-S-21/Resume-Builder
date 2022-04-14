const express = require('express');
const fs = require("fs");
const store = require("../middleware/multer");
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Resume = require('../models/Resume');
const { resourceLimits } = require('worker_threads');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const router = express.Router();

const declaration = "I, hereby declare that the above information is true to the best of my knowledge.";
let username, files, personalDetails, academicCredentials, projects, extraInfo, finalImg;
var today = new Date();
var date = today.getDate()+'/'+today.getMonth()+1+'/'+today.getFullYear();

router.route('/login')
    .get((req, res) => {  
        res.render('login', {usernameError: null, passwordError: null});
    })
    .post((req, res) => {
        username = req.body.username;
        const password = req.body.password;
        const log = req.body.log;

        // Admin.register({username: username}, password, (err, admin) => {
        //     if(err){
        //         console.log(err);
        //         res.redirect("/login");
        //     }
        //     else{
        //         passport.authenticate("local")(req, res, () => {
        //             res.redirect('/dashboard');
        //         });
        //     }
        // });

        if (log == 'adminLog'){

            passport.use(Admin.createStrategy());

            passport.serializeUser(Admin.serializeUser());
            passport.deserializeUser(Admin.deserializeUser());

            const user = new Admin({
                username: username,
                password: password
            });
    
            req.login(user, (err) =>{
                if(err){
                    console.log(err);
                }
                else{
                    passport.authenticate("local")(req, res, () =>{
                        res.redirect('/Dashboard');
                    });
                }
            });
        }

        else if (log == 'facultyLog'){

            passport.use(Faculty.createStrategy());

            passport.serializeUser(Faculty.serializeUser());
            passport.deserializeUser(Faculty.deserializeUser());

            const user = new Faculty({
                username: username,
                password: password
            });
    
            req.login(user, (err) =>{
                if(err){
                    console.log(err);
                }
                else{
                    passport.authenticate("local")(req, res, () =>{
                        res.redirect('/facultyDashboard');
                    })
                }
            })
        }

        else if (log == 'studentLog'){

            passport.use(Student.createStrategy());

            passport.serializeUser(Student.serializeUser());
            passport.deserializeUser(Student.deserializeUser());

            const user = new Student({
                username: username,
                password: password
            });
    
            req.login(user, (err) =>{
                if(err){
                    console.log(err);
                }
                else{
                    passport.authenticate("local")(req, res, () =>{
                        res.redirect('/studentDashboard');
                    })
                }
            })
        }
        else
        res.render('login', {usernameError: "Invalid username", passwordError: null});
    });

router.route('/dashboard')
    .get((req, res) => {

        if(req.isAuthenticated())
        res.render('dashboard');
        else
        res.redirect('/login');
    });

router.route('/facultyDashboard')
    .get((req, res) => {
        if(req.isAuthenticated())
        res.render('fetchResume', {error: null});
        else
        res.redirect('/login');
    })
    .post((req, res) => {
        username = req.body.username;

        Resume.find({roll: username}, (err, result) => {
            if (err)
                console.log(err);
            else {
                if(result.length == 0)
                    res.render('fetchResume', {error: "Student Resume does not exist"});
                else{
                    result.forEach((help) => {
                        res.render("resume", {
                            finalImg: help.Image,
                            details: help.Details,
                            extra: help.extra,
                            academics: help.academics,
                            projects: help.projects,
                            declaration: declaration,
                            thedate: date
                        });
                    });
                }
            }
        });
    });

router.post('/addStudent',(req, res) => {
    username = req.body.username;
    const password = req.body.password;

    passport.use(Student.createStrategy());

    passport.serializeUser(Student.serializeUser());
    passport.deserializeUser(Student.deserializeUser());

    Student.register({username: username}, password, (err, student) => {
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req, res, () => {
                res.redirect('/dashboard');
            });
        }
    });
    
});

router.post('/removeStudent',(req, res) => {
    const username = req.body.username;
    const confirm = req.body.confirm;

    if(confirm === 'CONFIRM'){
        Student.findOneAndDelete({username: username})
            .then(() => console.log('removed'));
    }
    res.redirect('/dashboard');
});

router.post('/addFaculty',(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    passport.use(Faculty.createStrategy());

    passport.serializeUser(Faculty.serializeUser());
    passport.deserializeUser(Faculty.deserializeUser());

    Faculty.register({username: username}, password, (err, faculty) => {
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req, res, () => {
                res.redirect('/dashboard');
            });
        }
    });

});

router.post('/removeFaculty',(req, res) => {
    const username = req.body.username;
    const confirm = req.body.confirm;

    if(confirm === 'CONFIRM'){
        Faculty.findOneAndDelete({username: username})
            .then(() => console.log('removed'));
    }
    
    res.redirect('/dashboard');
});

router.route('/studentDashboard')
    .get((req, res) => {

        const editplease = req.body.editPlease;
        // console.log(editplease);
        if(req.isAuthenticated())
        res.render('studentDashboard');
        else
        res.redirect('/login');
    });

router.route('/personalDetails')
    .get(async(req, res) => {

        
        // if (await Resume.exists({ roll: username })){
        //     console.log("exists");
        //     await Resume.deleteOne({roll: username}).then(() => console.log("deleted"));
        // }

        // if ( Resume.exists({ roll: username })){
        //     console.log('pers exits')
        //     Resume.findOne({roll: username}, (err, foundDocument) => {
        //         if(err) throw err;
        //         if(foundDocument){
        //             console.log(foundDocument.Details);
        //             if(foundDocument.Details){

        //             }
        //             else
        //             console.log('no');
        //         }
        //     });
        // }

        res.render('personalDetails');
    })
    .post(store.array('studImages', 1), (req, res) => {

        files = req.files;
        
        if(!files){
            const error = new Error("Please choose an image");
            error.httpStatusCode = 400;
            return next(error);
        }

        let imgArray = files.map((file) => {
            let img = fs.readFileSync(file.path);
            return encode_image = img.toString('base64');
        });

        finalImg = {
            filename: files[0].originalname,
            contentType: files[0].mimetype,
            imageBase64: encode_image
        }
        personalDetails = req.body;
        
        if(Resume.exists({roll: username})){
            console.log("Exists");
        }
        else{
            console.log("no");
        }

        // Resume.updateOne({roll: username}, personalDetails, null, (err, result) => {
        //     if (err) throw err;
        //     else console.log(result);
        // });

        const studentDetails = Resume({
            roll: username,
            Image: finalImg,
            Details: personalDetails
        });

        res.redirect('/studentDashboard');
    });

router.route('/academicCredentials')
    .get((req, res) => {
        res.render('academicCredentials');
    })
    .post((req, res) => {
        academicCredentials = req.body;

        // if(Resume.exists({roll: username})){
            // console.log("Exists");
        // }
        // else{
            // console.log("no");
        // }
        // Resume.updateOne({roll: username}, academicCredentials, null, (err, result) => {
        //     if (err) throw err;
        //     else console.log(result);
        // });

        const studentDetails = Resume({
            roll: username,
            academics: academicCredentials
        });

        res.redirect('/studentDashboard');
    });

router.route('/projects')
    .get((req, res) => {
        res.render('projects');
    })
    .post((req, res) => {
        projects = req.body;

        // Resume.updateOne({roll: username}, projects, null, (err, result) => {
        //     if (err) throw err;
        //     else console.log(result);
        // });

        const studentDetails = Resume({
            roll: username,
            projects: projects
        });

        res.redirect('/studentDashboard');
    });

router.route('/extraInfo')
    .get((req, res) => {
        res.render('extra');
    })
    .post((req, res) => {
        extraInfo = req.body;

        const studentDetails = Resume({
            roll: username,
            extra: extraInfo
        });

        res.redirect('/studentDashboard');
    });

router.route('/resume')
    .get((req, res) => {
        const studentDetails = new Resume({
            roll: username,
            Image: finalImg,
            Details: personalDetails,
            academics: academicCredentials,
            projects: projects,
            extra: extraInfo,
        });

        Resume.insertMany(studentDetails, (err) => {
            if (err)
                console.log(err);
            else
                console.log("Added Successfully");
        });

        // studentDetails.save().then(() => {
            console.log(username);
            Resume.find({roll: username}, (err, result) => {
                if (err)
                    console.log(err);
                else {
                    // console.log(result);
                    result.forEach((help) => {
                        res.render("resume", {
                            // roll: help.username,
                            finalImg: help.Image,
                            details: help.Details,
                            extra: help.extra,
                            academics: help.academics,
                            projects: help.projects,
                            declaration: declaration,
                            thedate: date
                        });
                    });
                }
            });
        });

router.route('/fetchResumE')
    .get((req, res) => {


        Resume.find({roll: username}, (err, result) => {
            if (err)
                console.log(err);
            else {
                result.forEach((help) => {
                    // console.log(help.Details); 
                    // console.log(help.academics); 
                    res.render("resume", {
                        roll: help.username,
                        finalImg: help.Image,
                        details: help.Details,
                        extra: help.extra,
                        academics: help.academics,
                        projects: help.projects,
                        declaration: declaration,
                        thedate: date
                    });
                });
            }
        });
    });

router.route('/logout')
    .get((req, res) =>{
        req.logout();
        res.redirect('/login');
    })

module.exports = router;