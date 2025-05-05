/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const express = require('express');
var cors = require('cors');
const app = express();
const { v4 } = require('uuid');
const morgan = require('morgan');
const multer = require('multer');

const MEDIA_PATH = process.env.MEDIA_PATH || '../config/media';
console.log('MEDIA ENV', MEDIA_PATH);
const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, MEDIA_PATH),
    filename: (req, file, callback) =>
        callback(
            null,
            v4() + '-' + Date.now() + path.extname(file.originalname)
        ),
});
const upload = multer({ storage });

app.use(cors());

app.use(
    '/media',
    morgan(
        '[:date[iso]] :method :url :status :res[content-length] - :response-time ms'
    )
);
app.use('/media', express.static(path.resolve(__dirname, MEDIA_PATH)));

app.post('/file', upload.single('file'), (req, res) => {
    if (req.file) {
        const shortPath = req.file.path.replace(MEDIA_PATH + '/', '');
        res.json({ path: shortPath });
    } else {
        res.json({ success: false });
    }
});

app.listen(3040, 'localhost', (err) => {
    if (err) console.error(err);
    else
        console.info(
            `Listening at http://localhost:3040, serving static folder media and ready to upload`
        );
});
