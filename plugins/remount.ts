import { Plugin } from '@nuxt/types';

const remountPlugin: Plugin = ({ app }, inject) => {
    inject('remount', (componentName: string) => {
        /* @ts-ignore */
        app.router.beforeEach((to, from, next) => {
            if (to.name === componentName) {
                // Remove the component from the router's cache
                app.router.app.$options.components[componentName] = null;
            }
            next();
        });
    });
};

export default remountPlugin;
