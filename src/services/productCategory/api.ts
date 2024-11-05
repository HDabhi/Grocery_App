import { useAuth } from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

export interface RecentOrderProduct {
  cartName: string;
  personName: string;
  ekartId: string;
  city: string;
  street: string;
  phone: string;
  pincode: string;
  latitude: number;
  longitude: number;
  state: string;
  deliveryCharge: number;
  otherCharger: number;
  mrp: number;
  sellingPrice: number;
  selfLife: string;
  expiryDate: string | null;
  sellingUom: string;
  productName: string;
  productId: string;
  productDescription: string;
  categoryName: string;
  categoryId: string;
  imageUrl: string;
  subCategoryName: string;
  subCategoryId: string;
  uomName: string;
  uomCode: string;
  uomSellingQuantity: number;
  availableQuantity: number;
}

export const getCategory = async () => {
  const { token } = useAuth.getState()
  const response = await axiosInstance.get(`/ecommerce/category/getAll?token=${token}`);
  return response.data;
};

export const getSubCategory = async (categoryId) => {
  const { token } = useAuth.getState()
  const response = await axiosInstance.get(`/ecommerce/subcategory/get_by_categoryId/${categoryId}?token=${token}`);
  return response.data;
};

export const getHomeData = async () => {
  const { token } = useAuth.getState()
  const response = await axiosInstance.get(`/ecommerce/product/get_home_screen?token=${token}`);
  return response.data;
};

export const getRecentOrderProduct = async () => {
  const { token } = useAuth.getState()
  const response = await axiosInstance.get(`/ecommerce/order/get_recent_order_product?token=${token}`);
  return response.data;
};

