const express = require('express');
const app = express();
const port = 3000;
const base = `${__dirname}/public`;

//middleware
app.use(express.static('public'));

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
app.get('/',(req, res) => {
    res.send('hello world');
});

//listens on a port, gives output on port in console.
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})