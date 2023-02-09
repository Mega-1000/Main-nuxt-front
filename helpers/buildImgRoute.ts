const buildImgRoute = (path: string) =>
  path ? "https://www.admin.mega1000.pl" + path : defaultImgSrc;

export const defaultImgSrc = "https://via.placeholder.com/185x150";

export default buildImgRoute;
