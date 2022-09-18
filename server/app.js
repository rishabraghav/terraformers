const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/usersDB', {useNewUrlParser: true, useUnifiedTopology: true});

const UsersSchema = {
    title: String,
    agenda: String,
    time: Number,
    guest: String
    // name: {
    //     type: String,
    //     required: true
    // },
    // offhours: {
    //     type: new Date(),
    //     required: true
    // },
    // appointments: [{
    //     title: String,
    //     agenda: String,
    //     time: new Date(),
    //     guest: String
    // }]
}

let userArray = [{
    title: "title",
        agenda: "agenda",
        time: 45,
        guest: "guest"
}, {
    title: "title",
        agenda: "agenda",
        time: 45,
        guest: "guest"
}, {
    title: "title",
        agenda: "agenda",
        time: 45,
        guest: "guest"
}];

const User = mongoose.model('User', UsersSchema);

app.get('/', (req, res) => {
    res.render('home', {
        users: userArray
    });
});

app.post('/', (req, res) => {
    const title = req.body.title;
    const agenda = req.body.agenda;
    const time = req.body.time;
    const guest = req.body.guest;

    const user = new User({
        title: title,
        agenda: agenda,
        time: time,
        guest: guest
    });

    userArray.push(user);
    user.save();
    res.redirect('/');
});

app.listen(3000, function(req, res) {
    console.log("server started in port 3000");
});
