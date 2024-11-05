import moment from 'moment';
import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference dimensions (e.g., based on iPhone 8 Plus)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 736;

// Utility function to detect if the device is a tablet
const isTablet = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return DeviceInfo.isTablet || (Platform.OS === 'ios' && aspectRatio < 1.6);
};

// Responsive width based on screen size
export const responsiveWidth = (width: number) => {
  return (width / BASE_WIDTH) * SCREEN_WIDTH;
};

// Responsive height based on screen size
export const responsiveHeight = (height: number) => {
  return (height / BASE_HEIGHT) * SCREEN_HEIGHT;
};

// Responsive font size based on screen size
export const responsiveFontSize = (fontSize: number) => {
  const factor = isTablet() ? 1.3 : 1; // Increase font size on tablets
  return (fontSize / BASE_WIDTH) * SCREEN_WIDTH * factor;
};

export function getDeliveryTime(timeString : string) {
  // Parse the input time using moment.js
  const duration = moment.duration(timeString);
  
  // Extract hours and minutes from the parsed duration
  const minutes = duration.minutes();
  const hours = duration.hours();
  
  // Format the output string based on hours and minutes
  if (hours > 0) {
    return `Delivery in ${hours} hours and ${minutes} minutes`;
  } else {
    return `Delivery in ${minutes} minutes`;
  }
}

export const checkTimeDifference = (updatedTime : string) => {
  let isUpto2hours = false
  const updatedDate = new Date(updatedTime);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifferenceMs = currentDate - updatedDate;

  // Convert milliseconds to hours
  const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

  // Check if the difference is greater than 2 hours
  if (timeDifferenceHours > 2) {
    console.log('More than 2 hours have passed.');
    isUpto2hours = true
  } else {
    console.log('Less than 2 hours have passed.');
    isUpto2hours = false
  }

  return isUpto2hours
};

export const isStoreOpen = (openingTime : string,closingTime : string) => {

  const currentTime = new Date();
  
  // Create Date objects with today’s date but use opening and closing times
  const openingDate = new Date();
  const [openingHour, openingMinute] = openingTime.split(":").map(Number);
  openingDate.setHours(openingHour, openingMinute, 0);

  const closingDate = new Date();
  const [closingHour, closingMinute] = closingTime.split(":").map(Number);
  closingDate.setHours(closingHour, closingMinute, 0);

  // Check if the current time is within opening and closing times
  console.log("openingDate : " + openingDate)
  console.log("closingDate : " + closingDate)
  console.log("currentTime : " + currentTime)
  if (currentTime >= openingDate && currentTime <= closingDate) {
    return true;
  } else {
    return false;
  }
};

