import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

export const getProductListing = async (filterData: object) => {
  const {token} = useAuth.getState();

  const response = await axiosInstance.post(
    `/ecommerce/product/get_product_listing_app?page=${filterData?.pageNumber}&pageSize=10&filterId=${filterData?.categoryId}&filterId2=${filterData?.subCategoryId}&token=${token}`,
    filterData.filterData,
  );

  console.log("Product List : " +  JSON.stringify(response))
  
  return response.data;
};

export const getProductByCategory = async (categoryId: string) => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/product/get_by_category_id?categoryId=${categoryId}&token=${token}`,
  );
  return response.data;
};

export const searchProduct = async (text: string) => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/product/search?searchText=${text}&token=${token}`,
  );
  return response.data;
};

