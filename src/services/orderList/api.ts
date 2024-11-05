import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

interface OrderProductDto {
  id: string;
  createdTime: string;
  updatedTime: string | null;
  status: boolean;
  cartItemId: string;
  mrp: number;
  sellingPrice: number;
  selfLife: string;
  expiryDate: string | null;
  sellingUom: string;
  productName: string;
  productId: string;
  categoryName: string;
  categoryId: string;
  imageUrl: string;
  subCategoryName: string;
  subCategoryId: string;
  quantity: number;
  orderId: string;
  sellingUomName: string;
  sellingUomQuantity: number;
  gstValue: number;
  sellingPriceWithoutTax: number;
  cgstPercent: number;
  sgstValue: number;
  cgstValue: number;
  sgstPercent: number;
}

interface EkartDto {
  id: string;
  createdTime: string;
  updatedTime: string;
  status: boolean;
  cartName: string;
  personName: string;
  city: string;
  street: string;
  phone: string;
  pincode: string;
  latitude: number;
  longitude: number;
  state: string;
  deliveryCharge: number;
  otherCharger: number;
  retailerId: string;
  gstPercent: number;
  deliveryTime: string;
  role: string;
  cgstPercent: number;
}

interface UserAddressDto {
  id: string;
  createdTime: string;
  updatedTime: string;
  status: boolean;
  userId: string;
  pincode: number;
  longitude: number;
  latitude: number;
  city: string;
  street: string;
  houseNumber: string;
  state: string;
  primary: boolean;
}

interface PaymentDto {
  id: string;
  createdTime: string;
  updatedTime: string;
  status: boolean;
  userId: string;
  razorPayOrderId: string;
  amount: number;
  currency: string;
  orderId: string;
  paymentStatus: string;
  ekartId: string;
  paymentId: string;
  retailerId: string;
  orderSerialNumber: string | null;
  ekartName: string | null;
  userName: string | null;
  mobile: string | null;
  paymentSignature: string;
}

export interface Order {
  id: string;
  createdTime: string;
  updatedTime: string | null;
  status: boolean;
  orderId: string;
  ekartId: string;
  price: number;
  discount: number;
  finalPrice: number;
  deliveryCharges: number;
  otherCharges: number;
  paymentType: string;
  orderStatus: string;
  userId: string;
  orderCompletionStatus: string;
  text: string | null;
  orderProductDtoList: OrderProductDto[];
  ekartDto: EkartDto;
  userAddressId: string;
  userAddressDto: UserAddressDto;
  totalWithoutDiscount: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  deliveryTime: string;
  offerDiscount: number;
  gstValue: number;
  gstByEkart: number;
  ekartName: string;
  deliveryChargeGst: number;
  otherChargeGst: number;
  gstCValue: number;
  gstSValue: number;
  paymentDtoList: PaymentDto[];
  imageurl: string;
  productCGstValue: number;
  productSGstValue: number;
  allProductGstValue: number;
  deliveryChargeCGstValue: number;
  deliveryChargeSGstValue: number;
  otherChargeCGstValue: number;
  otherChargeSGstValue: number;
  invoiceUrl: string;
  cgstByEkart: number;
  returnCompletionStatus: string;
  accepted: boolean;
  rejected: boolean;
}

export const getOrderListing = async (page: number) => {
  const {token, cartId} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/order/get_all_v2?page=${page}&pageSize=10&token=${token}`,
  );
  return response.data;
};

export const getOrderById = async orderId => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/order/getById/${orderId}?token=${token}`,
  );
  return response.data;
};

export const orderCancelReturn = async orderCancel => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/order/start_return_or_refund?description=${orderCancel?.reason}&image=${orderCancel?.image}&orderId=${orderCancel?.orderId}&orderStatus=${orderCancel?.orderStatus}&token=${token}`,
  );
  return response.data;
};

export const orderStatusUpdate = async orderData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.put(
    `/ecommerce/order/update/${orderData?.id}?token=${token}`,
    orderData,
  );
  return response.data;
};

export const uploadImage = async orderData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.post(
    `/ecommerce/aws/upload_image?token=${token}`,
    orderData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const orderProductDetails = async orderData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/ekart/get_by_ekartId_productId?ekartId=${orderData?.eKartId}&productId=${orderData?.productId}&token=${token}`,
  );
  return response.data;
};
