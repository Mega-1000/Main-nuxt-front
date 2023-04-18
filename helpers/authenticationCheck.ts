// @ts-ignore
import { setCookie } from "~/helpers/authenticator";

const checkIfUserIsLoggedIn = async (message: String) => {
    const { $shopApi: shopApi } = useNuxtApp();

    try {
        const { data: user } = await shopApi.get('/api/user');

        return user;
    } catch (e) {
        // @ts-ignore
        await loginFromGetParams(true, message);
    }
}

const loginFromGetParams = async (redirect: boolean, message: string = 'Ta strona jest dostępna tylko dla zalogowanych użytkowników') => {
    const router = useRouter();
    const { $shopApi: shopApi } = useNuxtApp();

    let { credentials } = router.currentRoute.value.query;
    if (!credentials) {
        return redirect ? router.push(`/login?redirect=${router.currentRoute.value.fullPath}&message=${message}`) : null;
    }
    // @ts-ignore
    let email = credentials?.split(':')[0];
    // @ts-ignore
    let phone = credentials?.split(':')[1];

    try {
        const { data: user } = await shopApi.get('/api/user');
        return user;
    } catch (e) {
        if (email && phone) {
            try {
                // fix missing + symbol
                email = email.replace(/\s/gi, '+');
                // only get last 9 chars
                if(phone.length > 9) {
                    phone = phone.substr(-9);
                }
                clearGetParams();
                return await loginUser(email.toString(), phone.toString());
            } catch (e) {
                clearGetParams();
                return router.push(`/login?redirect=${router.currentRoute.value.fullPath}&message=${message}`);
            }
        }
    }

    clearGetParams();
    return redirect ? router.push(`/login?redirect=${router.currentRoute.value.fullPath}&message=${message}`) : null;
}

const loginUser = async (email: string, password: string) => {
    const { $shopApi: shopApi } = useNuxtApp();
    const router = useRouter();
    const config = useRuntimeConfig().public;

    const params = {
        grant_type: "password",
        client_id: config.AUTH_CLIENT_ID,
        client_secret: config.AUTH_CLIENT_SECRET,
        username: email,
        password: password,
        scope: "",
    };

    const res = await shopApi.post("oauth/token", params);
    setCookie(res.data);

    router.go(0);
    clearGetParams();
}

const clearGetParams = () => {
    const router = useRouter();

    const { email, phone } = router.currentRoute.value.query;

    if (email && phone) {
        router.push(router.currentRoute.value.fullPath);
    }
}

export { checkIfUserIsLoggedIn, loginFromGetParams }
