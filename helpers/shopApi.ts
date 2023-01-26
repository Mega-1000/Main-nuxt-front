import axios from "axios";
import {
  setCookie,
  getToken,
  getRefreshToken,
  removeCookie,
} from "~~/helpers/authenticator";
import tokenProvider from "axios-token-interceptor";

const instance = axios.create({
  baseURL: "https://www.admin.mega1000.pl",
  timeout: 8000,
  headers: { Accept: "application/json" },
});
instance.interceptors.request.use(
  tokenProvider({
    getToken: () => getToken(),
  }) as any
);

instance.interceptors.response.use(
  (response) => response,
  function (error) {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest.url === "https://www.admin.mega1000.pl}oauth/token"
    ) {
      removeCookie();
      return Promise.reject(error);
    }
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      return instance
        .post("/oauth/token", {
          client_id: process.env.AUTH_CLIENT_ID,
          client_secret: process.env.AUTH_CLIENT_SECRET,
          scope: "",
          refresh_token: getRefreshToken(),
          grant_type: "refresh_token",
        })
        .then((res) => {
          if (res.status === 200) {
            setCookie(res);
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.data.access_token}`;
            return instance(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default instance;
