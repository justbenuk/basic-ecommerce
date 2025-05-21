export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Basic Store";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce store built with NextJS";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost.3000`;
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReveiws: "0",
  isFeatured: false,
  banner: null,
};
