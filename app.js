const devices = [];

devices.push({user: "Shae", name: "Shae's Laptop"});
devices.push({ user: "Mary", name: "Mary's iPhone" });
devices.push({ user: "Shae", name: "Shae's Pixel 3" });

devices.forEach(function(device) {
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

    $('#devices tbody').append(
        <tr>
            <td>$(device.user)</td>
            <td>$(device.name)</td>
        </tr>
    );
});