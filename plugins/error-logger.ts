export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('error', (error, context) => {
        console.error('[Nitro Error]', error.stack || error)
    })
})
