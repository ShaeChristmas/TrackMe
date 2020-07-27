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

/**
 * @api {post} /api/authenticate AuthUser
 * @apiGroup Users
 * @apiDescription Authenticates user
 * @apiError UserNotFound
 * @apiErrorExample Error-Response:
 *     'Username does not exist"
 * @apiError IncoPass
 * @apiErrorExample Error-response:
 *     'Password does not match'
 * @apiSuccess goodAuth
 * @apiSuccessExample
 * {
 *      success: true,
 *      message: 'Authenticated successfully',
 *      isAdmin: null
 * }
 *     
 */
app.post('/api/authenticate',(req,res)=> {
    const {username,pass,isAdmin} = req.body;

    User.findOne({name: username},(err,data) =>{
        if(err) {
            res.send(err);
        }else if (!data) {
            res.send('Username does not exist.');
        }else if((data.password == pass)) {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: isAdmin
            });
        }else{
            res.send('Password does not match.');
        }
    });
});


app.get('/api/users/:user/devices',(req,res)=> {
    const {user} = req.params;
    Device.find({"user": user},(err,devices)=>{
        return err
        ? res.send(err)
        : res.send(devices);
    });
});
/**
 * @api {post} /api/registration RegisterUser
 * @apiGroup Users
 * @apiDescription Registers new User
 * @apiError UserExists
 * @apiErrorExample Error-Response:
 *     'User already exists'
 * @apiError NullField
 * @apiErrorExample Error-Response:
 *     'Cannot have Null fields'
 * @apiSuccess goodNewUser
 * @apiSuccessExample Success-Reponse:
 *     {
 *        "success": true,
 *        "message": "Created new user"
 *     }
 */
app.post('/api/registration',(req,res)=> {
    name = req.body.username;
    pass = req.body.pass;
    isAdmin = req.body.isAdmin;
    User.findOne({name: name},(err,data)=>{
        if(err) {
            res.send(err);
        }else if(data){
            res.send('User already exists');
        }else if((name == null)||(pass == null)){
            res.send('Cannot have Null fields');
        }else{
            const newUser = new User({name: name, password: pass, isAdmin:0});
            newUser.save(err => {
                return err
                ? res.send(err)
                : res.json({
                    success: true,
                    message: 'Created new user'
                });
            });
        }
    });
});

/**
 * @api {post} /api/devices/:deviceID/device-history deviceHistory
 * @apiGroup Devices
 * @apiDescription Accesses device history
 * @apiError invDeviceID
 * @apiSuccess goodDeviceID
 * @apiSuccessExample Success-Reponse:
 *    {
 *       "ts": "1529542230",
 *       "temp": 12,
 *       "loc": {
 *           "lat": -37.850026,
 *           "lon": 145.117683
 *       }
 *    }
 */
app.get('/api/devices/:deviceID/device-history', (req,res)=> {
    const {deviceID} = req.params;
    Device.findOne({"_id": deviceID},(err,devices)=> {
        const {sensorData} = devices;
        return err
        ? res.send(err)
        : res.send(sensorData);
    });
});

/**
 * @api {get} /api/users/:user/devices ShowingUserDevices
 * @apiGroup Devices
 * @apiDescription Accesses devices that belong to the user
 */
app.get('/api/users/:user/devices',(req,res)=>{
    const{user} =req.params;
    Device.find({"user":user},(err,devices)=>{
        return err?res.send(err):res.send(devices);
    });
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

const Device = require(`./models/device`);
const { findOne, findOneAndUpdate } = require(`./models/device`);
const User = require(`./models/user`);