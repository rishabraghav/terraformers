const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
require("dotenv").config(); 

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "something",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});


const UsersSchema = new mongoose.Schema ({
    username: String,
    password: String,
});



// const AppointmentSchema = new mongoose.Schema ({
//     username: String,
//     name: String,
//     title: String,
//     agenda: String,
//     time: Number,
//     guest: String
// })

let name;
let username;

UsersSchema.plugin(passportLocalMongoose);

let appointmentArray = [];

const User = mongoose.model('Users', UsersSchema);
// const Appointment = mongoose.model('Appointments', AppointmentSchema, 'users');

passport.use(User.createStrategy());

passport.serializeUser(function(User, done) {
    done(null, User);
  });
  
  passport.deserializeUser(function(User, done) {
    done(null, User);
  });


app.get('/', (req, res) => {
    res.render('login', {
        name: name
    });
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})


app.get('/home', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('home', {
            users: appointmentArray,
            name: name
        });
    } else{
        res.redirect('/login');
    }
    
});

app.post('/home', (req, res) => {
    const title = req.body.title;
    const agenda = req.body.agenda;
    const time = req.body.time;
    const guest = req.body.guest;

    const appointment = {
        title: title,
        agenda: agenda,
        time: time,
        guest: guest
    };

    appointmentArray.push(appointment);
    // appointment.save();
    res.redirect('/home');
});

app.post('/login', (req, res) => {
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect('/home');
            });
        }
    });
});

// app.post('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/login');
// });
app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


app.post('/register', (req, res) => {
    name = req.body.name;
    username = req.body.username;

    // const newAppointment = new Appointment({
    //     username: username,
    //     name: name
    // });

    // console.log(newAppointment);
    // newAppointment.save();

    console.log(name);
    console.log(username);
    User.register({username:req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect('/register');
         } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect('/home');
            })
         }

    });
});


app.listen(port, function(req, res) {
    console.log("server started in port 3000");
});
