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
//Middleware for apidoc
app.use(express.static(`${__dirname}/public/generated-docs`));

//Endpoint for apidoc
/**
 * @api {get} /docs GeneratedDoc Sending apidoc document
 * @apiGroup apidoc
 * @apiDescription Sends the apidoc generated document to the api.
 */
app.get('/docs', (req,res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

//Post Handling for newDevice. Helps the api receive new data, and writes it to mongodb
/**
 * @api {post} /api/devices NewDevice Sending New Device data to api
 * @apiGroup Devices
 * @apiDescription Sends a New device to the api, returns error if unable to.
 */
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

/**
 * @api {post} /api/send-command SendCommand Sending Command to api
 * @apiGroup Devices
 * @apiDescription Sends command to API, logs it and sends to console.
 */
app.post('/api/send-command',(req,res)=>{
    console.log(req.body);
});

const port = process.env.PORT || 5000;

/**
 * @api {get} /api/test TestAPI Testing the connection to API
 * @apiGroup Test
 * @apiDescription Tests that the API is working correctly on localhost.
 */
app.get('/api/test', (req,res) => {
    res.send("API is workin'!");
});

/**
 * @api {get} /api/devices AllDevices An array of all devices
 * @apiGroup Device
 * @apiSuccessExample {json} Success-Response:
 * [
 *     {
 *        "_id": "dsohsdohsdofhsofhosfhsofh",
 *        "name": "Mary's iPhone",
 *        "user": "mary",
 *        "sensorData": [
 *           {
 *              "ts": "1529542230",
 *              "temp": 12,
 *              "loc": {
 *                  "lat": -37.850026,
 *                  "lon": 145.117683
 *              }
 *           }
 *         ]
 *     }
 * ]
 * @apiErrorExample {json} Error-Response:
 * {
 *     "User does not exist"
 * }
 */
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