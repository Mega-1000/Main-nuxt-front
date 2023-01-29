export const usePhone = () => useState<string | null>("phone", () => null);
export const useCart = () => useState("cart", () => "");
