import { useMutation, useQuery } from '@tanstack/react-query'
import { getCategory, getHomeData, getRecentOrderProduct, getSubCategory } from './api'

export const useGetCategory = () => {
  return useQuery({
    queryKey: ['category'],
    queryFn: getCategory,
  })
}

export const useGetSubCategory = () => {
  return useMutation({
    mutationKey: ['subcategory'],
    mutationFn: getSubCategory,
  })
}

export const useGetHomeData = () => {
  return useQuery({
    queryKey: ['home'],
    queryFn: getHomeData,
  })
}

export const useGetRecentOrderProduct = () => {
  return useQuery({
    queryKey: ['recentProduct'],
    queryFn: getRecentOrderProduct,
  })
}



