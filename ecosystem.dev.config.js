module.exports = [
    {
        name: 'nextjs-dev',
        script: 'next',
        args: 'dev',
        watch: false,
        env: {
            NODE_ENV: 'development',
        },
    },
    {
        name: 'file-storage-dev',
        script: 'npm',
        args: 'start --prefix file-storage',
        watch: ['file-storage'],
        ignore_watch: ['node_modules'],
        env: {
            NODE_ENV: 'development',
            MEDIA_PATH: './config/media',
        },
    },
];
