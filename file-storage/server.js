// server.js
const path = require('path');
const express = require('express');
const app = express();
// tell express to use '/media' path as static route
app.use('/media', express.static(path.resolve(__dirname, '../config/media')));
app.listen(3040, 'localhost', (err) => {
    if (err) console.error(err);
    else console.info('Listening at http://localhost:3040');
});
