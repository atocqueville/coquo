module.exports = [
    {
        name: 'coquo',
        script: 'next',
        args: 'dev',
        watch: false,
    },
    {
        name: 'fs',
        script: 'npm',
        args: 'start --prefix file-storage',
        watch: ['file-storage'],
        ignore_watch: ['node_modules'],
        env: {
            MEDIA_PATH: '../config/media',
        },
    },
    {
        name: 'studio',
        script: 'npx',
        args: 'dotenv -e .env.local -- prisma studio',
        watch: false,
    },
];
