const buildImgRoute = (path: string, baseUrl: string) =>
  path ? baseUrl + path : defaultImgSrc;

export const defaultImgSrc = "https://placehold.co/185x150/EEE/31343C";

export default buildImgRoute;
