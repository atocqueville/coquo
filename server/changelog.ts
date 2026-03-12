import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

const app = express();

app.get('/', (_req, res) => {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    try {
        const content = fs.readFileSync(changelogPath, 'utf-8');
        res.type('text/markdown; charset=utf-8').send(content);
    } catch {
        res.status(404).send('Changelog not available.');
    }
});

export default app;
