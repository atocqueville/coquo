const path = require('path');
const express = require('express');
var cors = require('cors');
const app = express();
const { v4 } = require('uuid');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, '../config/media'),
    filename: (req, file, callback) =>
        callback(
            null,
            v4() + '-' + Date.now() + path.extname(file.originalname)
        ),
});
const upload = multer({ storage });

app.use(cors());

app.use('/media', express.static(path.resolve(__dirname, '../config/media')));

app.post('/file', upload.single('file'), (req, res) => {
    if (req.file) {
        const shortPath = req.file.path.replace('../config/media/', '');
        res.json({ path: shortPath });
    } else {
        res.json({ success: false });
    }
});

app.listen(3040, 'localhost', (err) => {
    if (err) console.error(err);
    else
        console.info(
            'Listening at http://localhost:3040, serving static folder media and ready to upload'
        );
});
