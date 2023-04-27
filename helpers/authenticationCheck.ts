import { loginUser, loginFromEmail } from "~/helpers/loginUser";
import { clearGetParams } from "~/helpers/getParams";

const checkIfUserIsLoggedIn = async (message: string) => {
    const { $shopApi: shopApi } = useNuxtApp();

    try {
        const { data: user } = await shopApi.get('/api/user');

        return user;
    } catch (e) {
        await loginFromGetParams(true, message);
    }
}

const loginFromGetParams = (redirect: boolean, message: string = 'Ta strona jest dostępna tylko dla zalogowanych użytkowników') => {
    const router = useRouter();
    const { $shopApi: shopApi } = useNuxtApp();

    let credentials: string = router.currentRoute.value.query.credentials as string;

    setTimeout(() => {
        if (!credentials) return redirect ? router.push(`/login?redirect=${router.currentRoute.value.fullPath}&message=${message}`) : null;
    }, 500);

    let email = credentials?.split(':')[0];
    let phone = credentials?.split(':')[1];

    try {
        const { data: user } = shopApi.get('/api/user') as any;
        return user;
    } catch (e) {
        if (email && phone) {
            try {
                email = email.replace(/\s/gi, '+');
                if (phone.length > 9) {
                    phone = phone.substr(-9);
                }
                clearGetParams();
                return loginUser(email.toString(), phone.toString());
            } catch (e) {
                redirectToLogin(message);
            }
        }
    }

    redirectToLogin(message);
}

const redirectToLogin = (message: string = 'Ta strona jest dostępna tylko dla zalogowanych użytkowników') => {
    const router = useRouter();
    clearGetParams();

    return router.push(`/login?redirect=${router.currentRoute.value.fullPath}&message=${message}`);
}

const handleOnlyEmail = (email: string) => {
    const login = loginFromEmail(email);

    if (!login) {
        window.location.href = `/fill-phone-number?email=${email}`;
        return;
    }

    return;
}


export { checkIfUserIsLoggedIn, loginFromGetParams };
