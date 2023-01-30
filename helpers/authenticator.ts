import Cookies from "universal-cookie";

interface Data {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

function setCookie({ access_token, refresh_token, expires_in }: Data) {
  const cookies = new Cookies();
  var date = new Date();
  date = new Date(date.getTime() + expires_in * 1000);
  cookies.set("token", access_token, { expires: date });
  if (refresh_token) {
    cookies.set("refresh_token", refresh_token);
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
