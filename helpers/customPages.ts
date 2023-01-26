import api from "~~/helpers/shopApi";

export const getPages = async () => {
  const res = await api.get("/api/custom/pages");
  return {
    customPages: res.data.tree,
    allPages: res.data.pages,
  };
};

export const getContent = (allPages: any[], pageId: string) => {
  if (!allPages) {
    return "";
  }
  var ret = allPages.find((page) => page.id === parseInt(pageId));
  return ret ? ret.content : "";
};
