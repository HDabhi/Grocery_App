import { useMutation } from '@tanstack/react-query'
import { authenticateByOTP, generateOTP } from './api'

export const useGenerateOTP= () => {
  return useMutation({
    mutationKey: ['otp'],
    mutationFn: generateOTP,
  })
}

export const useAuthenticateByOTP= () => {
  return useMutation({
    mutationKey: ['authOtp'],
    mutationFn: authenticateByOTP,
  })
}



