const buildImgRoute = (path: string) =>
  path ? process.env.APP_STORAGE + path : defaultImgSrc;

export const defaultImgSrc = "https://via.placeholder.com/185x150";

export default buildImgRoute;
