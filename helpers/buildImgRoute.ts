const buildImgRoute = (path: string, baseUrl: string) =>
  path ? baseUrl + path : defaultImgSrc;

export const defaultImgSrc = "/no-image.png";

export default buildImgRoute;
