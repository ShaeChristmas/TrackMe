const express = require('express');

const app = express();
const port = 5000;

//sends response on get request
app.get('/api/test', (req,res) => {
    res.send("'API is workin'!");
});

//listens for requests on port.
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

