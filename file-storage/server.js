/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const morgan = require('morgan');
const multer = require('multer');
const sharp = require('sharp');

const app = express();

const MEDIA_PATH = process.env.MEDIA_PATH || '../config/media';
const ABS_MEDIA_PATH = path.resolve(__dirname, MEDIA_PATH);

console.log('MEDIA ENV', MEDIA_PATH);

// Use memory storage so we can compress manually
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

app.use(
    '/media',
    morgan(
        '[:date[iso]] :method :url :status :res[content-length] - :response-time ms'
    )
);
app.use('/media', express.static(ABS_MEDIA_PATH));

app.post('/file', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false });

    const { buffer } = req.file;
    const id = `${v4()}-${Date.now()}`;
    const filename = `${id}.webp`;
    const outputPath = path.join(ABS_MEDIA_PATH, filename);

    try {
        await sharp(buffer).webp({ quality: 75 }).toFile(outputPath);
        const shortPath = filename;
        return res.json({ success: true, path: shortPath });
    } catch (err) {
        console.error('Image compression failed:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3040, 'localhost', (err) => {
    if (err) console.error(err);
    else
        console.info(
            `Listening at http://localhost:3040, serving static folder media and ready to upload`
        );
});
