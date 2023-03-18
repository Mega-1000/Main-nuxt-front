module.exports = {
    apps: [
        {
            name: 'mega1000.pl',
            exec_mode: 'cluster',
            instances: 'max', // Or a number of instances
            script: './node_modules/nuxt/bin/nuxt.mjs',
            args: 'start'
        }
    ]
}
