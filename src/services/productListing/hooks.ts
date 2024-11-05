import { useMutation, useQuery } from '@tanstack/react-query'
import { getProductListing, getProductByCategory, searchProduct } from './api'

export interface ProductList {
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
  availableQuantity : number;
}

export const useGetProductList = () => {
  return useMutation({
    mutationKey: ['products'],
    mutationFn: getProductListing,
  })
}

export const useSearchProduct = () => {
  return useMutation({
    mutationKey: ['searchProducts'],
    mutationFn: searchProduct,
  })
}

export const useGetProductByCategory = (categoryId : string) => {
  return useQuery({
    queryKey: ['products',categoryId],
    queryFn: () => getProductByCategory(categoryId),
  })
}



