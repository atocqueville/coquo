module.exports = [
    {
        name: 'prisma-init',
        script: 'prisma/prisma-init.js',
        autorestart: false,
    },
    {
        name: 'nextjs',
        script: 'server.js',
    },
    {
        name: 'file-storage',
        script: 'file-storage/server.js',
        env: {
            MEDIA_PATH: '../../config/media',
        },
    },
];
