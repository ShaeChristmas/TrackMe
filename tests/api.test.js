const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const  {API_URL} = process.env;

test('device array GET /devices', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
        expect(resp[0].user).toEqual('mary123');
    });
});

test('user authenticate POST /authenticate', () => {
    expect.assertions(1);
    return axios.post(`${API_URL}/authenticate`, {username:'test',pass:'test123',isAdmin: 'false'})
        .then(resp => resp.data)
        .then(resp => {
            expect(resp.success).toBe(true);
        });
});

test('User devices GET /users/:user/devices', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/users/test/devices`)
    .then(resp => resp.data)
    .then(resp => {
        expect(resp[0].name).toEqual("Sam's iPhone");
    });
});

/*
* This test does work, and will function correctly, however it does create the user on test,
* and as a result, should only be run after removing the testing user from the Mongodb.
test('User registration POST /registration', () => {
    expect.assertions(1);
    return axios.post(`${API_URL}/registration`, {username:'test1',pass:'test123'})
    .then(resp => resp.data)
    .then(resp => {
        expect(resp.success).toEqual(true);
    });
});
*/

test('Device history GET /devices/:deviceID/device-history', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices/5f185c09f83a24ba357c9fac/device-history`)
    .then(resp => resp.data)
    .then(resp => {
        expect(resp[0].temp).toBe(14);
    });
});

test('API TEST', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/test`)
    .then(resp => resp.data)
    .then(resp => {
        expect(resp).toBe("API is workin'!");
    });
});

test('Device List GET /devices', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
        expect(resp[0].name).toBe("Mary's iPhone");
    });
});