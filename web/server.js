const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;

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
app.get('*',(req,res) => {
    res.sendfile(`${base}/404.html`);
});

//listens on a port, gives output on port in console.
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
