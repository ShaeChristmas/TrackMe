const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
const dotenv = require('dotenv');
const cookie = require('cookie-session');

dotenv.config();
const {MONGO_URL} = process.env
mongoose.connect(MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true})

const {GOOGLE_CLIENT_ID} = process.env;
const {GOOGLE_CLIENT_SECRET} = process.env;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        
        User.findOne({googleID: profile.id}).then((currentUser)=> {
            if(currentUser){
                done(null,currentUser);
            }else{
                new User({
                    googleID: profile.id,
                    name: profile.name.givenName,
                    isAdmin: false
                }).save().then((newUser)=>{
                    done(null,newUser);
                });
            }
        })
    }
));

app.use(cookie({
    maxAge: 24*60*60*1000,
    keys:[process.env.COOKIE_KEY]
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());


//middleware
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

/*
This is a route middleware. This means whenever the server gets a req(est),
the server will run the following code, and send the res(ponse).
Both res and req are objects.
Types of request:
- Get - requests data/file.
- Post - send data to create new record.
- Put - send data to update a record.
- delete - send request to remove a record.

the arrow is used in place of the function keyword, that line could be written as:
    app.get('/', function (req,res) {

gives a clearer syntax.
*/
app.get('/login',(req, res) => {
    res.sendfile(`${base}/login.html`);
});
app.get('/registration',(req, res) => {
    res.sendfile(`${base}/registration.html`);
});
app.get('/register-device',(req, res) => {
    res.sendfile(`${base}/register-device.html`);
});
app.get('/send-command',(req, res) => {
    res.sendfile(`${base}/send-command.html`);
});
app.get('/about',(req, res) => {
    res.sendfile(`${base}/about-me.html`);
});
app.get('/',(req, res) => {
    res.sendfile(`${base}/device-list.html`);
});
app.get('/logout',(req,res)=>{
    res.sendfile(`${base}/logout.html`);
});
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get('/auth/google/redirect', passport.authenticate('google'),(req,res)=>{
    const user = req.user;
    app.locals.user = user;
    res.redirect('/');
});

app.get('/auth/google/user', (req,res)=>{
    res.send(app.locals.user)
});

app.get('*',(req,res) => {
    res.sendFile(`${base}/404.html`);
});

//listens on a port, gives output on port in console.
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const User = require(`./models/user`);
