module.exports = [
    {
        name: 'prisma-migrate',
        script: 'npx',
        args: 'prisma migrate deploy',
        autorestart: false,
    },
    {
        name: 'nextjs',
        script: 'server.js',
    },
    {
        name: 'file-storage',
        script: 'file-storage/server.js',
    },
];
