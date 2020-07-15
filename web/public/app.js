$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
//Init device list
const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

//devices.push({user: "Shae", name: "Shae's Laptop"});
//devices.push({ user: "Mary", name: "Mary's iPhone" });
//devices.push({ user: "Shae", name: "Shae's Pixel 3" });

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
    */
});

//Listener for the Registration of a new Device.

$('#add-device').on('click', function() {
    const user = $('#user').val();
    const name = $('#name').val();
    devices.push({user, name});
    //console.log(devices);         Used for testing.
    localStorage.setItem('devices',JSON.stringify(devices));
    location.href = '/';
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
    console.log(`command is: ${command}`);
});

//Listener for Register Account
$('#reg-account').on('click', function() {
    const username = $('#username').val();
    const pass = $('#password').val();
    const Cpass = $('#Cpassword').val();
    $('#passErrorMessage').removeClass().text("");
    $('#usernameErrorMessage').removeClass().text("");

    const exists = users.find(user => user.name === username);
    //console.log(exists);

    if (exists == undefined) {
        if (pass === Cpass) {
            users.push({name: username, pass});
            localStorage.setItem('users',JSON.stringify(users));
        }else{
            $('#passErrorMessage').addClass("alert alert-error").text("Passwords do not match.");   
        }
    }else{
        $('#usernameErrorMessage').addClass("alert alert-error").text("Username already exists. Please input a new username.");
    }
});