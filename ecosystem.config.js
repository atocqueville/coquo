module.exports = [
    {
        name: 'prisma-migrate',
        script: 'npx',
        args: 'prisma migrate deploy',
        autorestart: false,
    },
    {
        name: 'prisma-seed',
        script: 'npx',
        args: 'prisma db seed',
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
