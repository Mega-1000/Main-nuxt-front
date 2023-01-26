import { AxiosResponse } from "axios";
import Cookies from "universal-cookie";

function setCookie(response: AxiosResponse<any, any>) {
  const cookies = new Cookies();
  var date = new Date();
  date = new Date(date.getTime() + response.data.expires_in * 1000);
  cookies.set("token", response.data.access_token, { expires: date });
  if (response.data.refresh_token) {
    cookies.set("refresh_token", response.data.refresh_token);
  }
}

function removeCookie() {
  const cookies = new Cookies();
  cookies.remove("token");
  cookies.remove("refresh_token");
}

function isUserLoggedIn() {
  return getToken();
}

function getToken() {
  const cookies = new Cookies();
  return cookies.get("token");
}

function getRefreshToken() {
  const cookies = new Cookies();
  return cookies.get("refresh_token");
}

export { setCookie, getToken, getRefreshToken, removeCookie };
