$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
//Init device list
const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

const API_URL = 'https://track-me-api.vercel.app/api';
const MQTT_URL = 'http://localhost:5001';

//devices.push({user: "Shae", name: "Shae's Laptop"});
//devices.push({ user: "Mary", name: "Mary's iPhone" });
//devices.push({ user: "Shae", name: "Shae's Pixel 3" });

/*
This code is no longer needed, as the listing of items is left to the json-server

//Displays each device on the Table.
devices.forEach(function(device) {
    $('#devices tbody').append(`
        <tr>
            <td>${device.user}</td>
            <td>${device.name}</td>
        </tr>`
    );
    /*
    This code wasn't used as its longer and more complex than the used code.
    However, its useful for this to remain as it allows for me to gain a better understanding of 
    JS as the unit goes on. 
    const table = document.querySelector('#devices');
    const row = document.createElement('tr');

    const user = document.createElement('td');
    const userText = document.createTextNode(device.user);
    user.appendChild(userText);

    const name = document.createElement('td');
    const nameText = document.createTextNode(device.name);
    name.appendChild(nameText);

    row.appendChild(user);
    row.appendChild(name);

    table.appendChild(row);
});
*/





$.get('/auth/google/user', (res)=>{
    console.log("get runs");
    const logGoogle = localStorage.getItem('logGoogle');
    console.log("Log google is apparently "+logGoogle);
    if (logGoogle){
        console.log("This is true");
        localStorage.setItem('user',res.name);
        localStorage.setItem('isAdmin',res.isAdmin);
        localStorage.setItem('isAuthenticated',true);
    }else{
        console.log("this is false");
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isAuthenticated');
    }
});


if (localStorage.getItem('logGoogle')) {
    const currentUser = localStorage.getItem('user');
    $.get(`${API_URL}/users/${currentUser}/devices`)
    .then(response => {
        response.forEach((device)=> {
            $('#devices tbody').append(`
                <tr data-device-id=${device._id}>
                    <td>${device.user}</td>
                    <td>${device.name}</td>
                </tr>`
            );
        });
        $('#devices tbody tr').on('click', (e) => {
            const deviceId = e.currentTarget.getAttribute('data-device-id');
            $.get(`${API_URL}/devices/${deviceId}/device-history`)
            .then(response => {
                response.map(sensorData => {
                    $('#historyContent').removeClass().text("");
                    $('#historyContent').append(`
                    <tr>
                        <td>${sensorData.ts}</td>
                        <td>${sensorData.temp}</td>
                        <td>${sensorData.loc.lat}</td>
                        <td>${sensorData.loc.lon}</td>
                    </tr>
                    `);
                });
                $('#historyModal').modal('show');
            });
        });
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
}else {
    const path = window.location.pathname;
    if(path !== '/login') {
        location.href = '/login';
    }
}

//Listener for the Registration of a new Device.

$('#add-device').on('click', function() {
    const user = $('#user').val();
    const name = $('#name').val();
    const sensorData = [];

    const body = {
        name,
        user,
        sensorData
    };

    $.post(`${API_URL}/devices`, body)
    .then(response => {
        location.href = '/';
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
});

/*
This method is good, but can be condensed. See above method.

document.querySelector('#add-device').addEventListener('click',
function() {
    const user = document.querySelector('#user').value;
    const name = document.querySelector('#name').value;
    devices.push({user: user, name:name});
    console.log(devices);
});
*/
//Listener for Send Command.
$('#send-command').on('click', function() {
    const command = $('#command').val();
    const devID = $('#deviceID').val();
    $.post(`${MQTT_URL}/send-command`, {devID,command}).then(response => {
        console.log(response);
    });
});

//Listener for Register Account
$('#reg-account').on('click', function() {
    const username = $('#username').val();
    const pass = $('#password').val();
    const Cpass = $('#Cpassword').val();

    $('#passErrorMessage').removeClass().text("");
    if (!(pass === Cpass)) {
        $('#passErrorMessage').addClass("alert alert-error").text("Passwords do not match.");
    }else{
        $.post(`${API_URL}/Registration`, {username,pass}).then(response=>{
            if(response.success) {
                location.href = '/login';
            }else{
                $('#passErrorMessage').append(`<p class="alert alert-deanger">${response}</p>`);
            }
        });
    }
});


//login click handler
$('#login').on('click', (req,res)=> {
    localStorage.setItem('logGoogle',true);
    location.href ='/auth/google';
});

$('#logout').on('click', (req,res)=>{
    localStorage.removeItem('logGoogle');
    location.href='/login';
});