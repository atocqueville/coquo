module.exports = [
    {
        name: 'migrate',
        script: 'node_modules/.bin/prisma',
        args: ['migrate', 'deploy'],
        autorestart: false,
    },
    {
        name: 'coquo',
        script: 'server.js',
    },
    {
        name: 'fs',
        script: 'file-storage/server.js',
        env: {
            MEDIA_PATH: '../../config/media',
        },
    },
];
