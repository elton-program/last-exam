import axios from "axios";
import type { Product } from "../type/shablon";

export const GetAll = async (): Promise<Product[]> => {
  const res = await axios.get("https://fakestoreapi.com/products");
  if (!res) {
    throw new Error("getda hato");
  }
  return res.data;
};
export const DeleteAp = async (id: number): Promise<void> => {
  const res = await axios.delete(`https://fakestoreapi.com/products/${id}`);
  if (!res) {
    throw new Error("deleteda hato");
  }
  return res.data;
};
export const PostAp = async (
  product: Omit<Product, "id">,
): Promise<Product> => {
  const result = await axios.post(
    "https://dummyjson.com/products/add",
    product,
  );
  if (!result) {
    throw new Error("addda hato");
  }
  return result.data;
};
export const EditAp = async (
  id: number,
  product: Product,
): Promise<Product> => {
  const result = await axios.put(
    `https://dummyjson.com/products/${id}`,
    product,
  );
  if (!result) {
    throw new Error("editda hato");
  }
  return result.data;
};
