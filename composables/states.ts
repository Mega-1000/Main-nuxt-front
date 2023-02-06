export const usePhone = () => useState<string | null>("phone", () => null);
export const useCart = () => useState("cart", () => "");
export const useCurrentItem = () => useState<any>("currentItem", () => null);
