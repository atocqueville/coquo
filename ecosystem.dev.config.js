module.exports = [
    {
        name: 'nextjs',
        script: 'next',
        args: 'dev',
        watch: false,
    },
    {
        name: 'file-storage',
        script: 'npm',
        args: 'start --prefix file-storage',
        watch: ['file-storage'],
        ignore_watch: ['node_modules'],
        env: {
            MEDIA_PATH: '../config/media',
        },
    },
    {
        name: 'prisma-studio',
        script: 'npx',
        args: 'dotenv -e .env.local -- prisma studio',
        watch: false,
    },
];
