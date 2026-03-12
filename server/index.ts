import dotenv from 'dotenv';
import { execSync } from 'node:child_process';
import express from 'express';
import next from 'next';
import mediaApp from './media.js';
import changelogApp from './changelog.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

dotenv.config({ path: '.env.local' });
dotenv.config();

const rootDir = process.cwd();

const port = parseInt(process.env.PORT || '3847', 10);
const dev = process.env.NODE_ENV !== 'production';

if (process.env.NODE_ENV === 'production') {
    try {
        execSync('node node_modules/.bin/prisma migrate deploy', {
            stdio: 'inherit',
            cwd: rootDir,
        });
    } catch (err) {
        console.error('Prisma migrate deploy failed:', err);
        process.exit(1);
    }
}

const createNextApp = next as unknown as (opts: { dev: boolean }) => {
    getRequestHandler: () => (req: IncomingMessage, res: ServerResponse) => void;
    prepare: () => Promise<void>;
};
const app = createNextApp({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        // Media (upload + static images) at /media
        server.use('/media', mediaApp);

        // Changelog at /changelog
        server.use('/changelog', changelogApp);

        // Everything else → Next.js
        server.all('*', (req, res) => handle(req, res));

        server.listen(port, () => {
            console.log(
                `> Ready on http://localhost:${port} (${dev ? 'development' : 'production'})`
            );
        });
    })
    .catch((err: unknown) => {
        console.error(err);
        process.exit(1);
    });
