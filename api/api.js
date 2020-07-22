const express = require('express');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

//body parser code
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(function(req, res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Post Handling for newDevice. Helps the api receive new data, and writes it to mongodb
app.post('/api/devices',(req,res)=>{
    const {name, user, sensorData} = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err=>{
        return err?res.send(err):res.send('Successfully added device and associated data');
    });
});

//Post Handling for send-command.
app.post('/api/send-command',(req,res)=>{
    console.log(req.body);
});

const port = process.env.PORT || 5000;

//sends response on get request
app.get('/api/test', (req,res) => {
    res.send("'API is workin'!");
});


//api endpoint; retreves all devices.
app.get('/api/devices',(req,res) => {
    Device.find({},(err,devices)=> {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});


//listens for requests on port.
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const Device = require('./models/device');