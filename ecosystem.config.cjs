module.exports = [
    {
        name: 'migrate',
        script: 'npx',
        args: 'prisma migrate deploy',
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
