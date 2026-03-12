import path from 'node:path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const MEDIA_PATH = '/media';

const MEDIA_DIR = path.join(process.cwd(), 'config', 'media');
const ABS_MEDIA_DIR = path.resolve(MEDIA_DIR);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.use(cors());
app.use('/', express.static(ABS_MEDIA_DIR));

app.post('/file', upload.single('file') as unknown as express.RequestHandler, async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false });
    const { buffer } = req.file;
    const id = `${uuidv4()}-${Date.now()}`;
    const filename = `${id}.webp`;
    const outputPath = path.join(ABS_MEDIA_DIR, filename);

    try {
        await sharp(buffer).webp({ quality: 75 }).toFile(outputPath);
        return res.json({ success: true, path: filename });
    } catch (err) {
        console.error('Image compression failed:', err);
        return res
            .status(500)
            .json({
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error',
            });
    }
});

app.post('/files', upload.array('files', 10) as unknown as express.RequestHandler, async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res
            .status(400)
            .json({ success: false, message: 'No files provided' });
    }

    try {
        const uploadedFiles: string[] = [];

        for (const file of req.files as Express.Multer.File[]) {
            const { buffer } = file;
            const id = `${uuidv4()}-${Date.now()}`;
            const filename = `${id}.webp`;
            const outputPath = path.join(ABS_MEDIA_DIR, filename);

            await sharp(buffer).webp({ quality: 75 }).toFile(outputPath);
            uploadedFiles.push(filename);
        }

        return res.json({ success: true, paths: uploadedFiles });
    } catch (err) {
        console.error('Image compression failed:', err);
        return res
            .status(500)
            .json({
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error',
            });
    }
});

export default app;
