/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const morgan = require('morgan');
const multer = require('multer');
const sharp = require('sharp');

const app = express();

/**
 * The media path is different for docker and local development
 * This is a workaround to make it work in local
 * When in production, the MEDIA_PATH variable is set in the ecosystem.config.js file
 */
const MEDIA_PATH = process.env.MEDIA_PATH || '../config/media';
const ABS_MEDIA_PATH = path.resolve(__dirname, MEDIA_PATH);

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

app.post('/files', upload.array('files', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res
            .status(400)
            .json({ success: false, message: 'No files provided' });
    }

    try {
        const uploadedFiles = [];

        for (const file of req.files) {
            const { buffer } = file;
            const id = `${v4()}-${Date.now()}`;
            const filename = `${id}.webp`;
            const outputPath = path.join(ABS_MEDIA_PATH, filename);

            await sharp(buffer).webp({ quality: 75 }).toFile(outputPath);
            uploadedFiles.push(filename);
        }

        return res.json({ success: true, paths: uploadedFiles });
    } catch (err) {
        console.error('Image compression failed:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3040, '127.0.0.1', (err) => {
    if (err) console.error(err);
    else
        console.info(
            `Listening at http://localhost:3040, serving static folder media and ready to upload`
        );
});
