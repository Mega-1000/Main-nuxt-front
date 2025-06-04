export default defineNuxtPlugin(() => {
    window.addEventListener('error', (event) => {
        console.error('[Global Error]', event?.error?.stack || event);
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('[Unhandled Promise Rejection]', event?.reason?.stack || event);
    });
});
