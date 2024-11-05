import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Define types for the functions
const horizontalScale = (size: number): number => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };

// Function            Usage
// verticalScale       height, marginTop, marginBotton, margin Vertical, line-height, paddingTop, paddingBotton, padding Vertical, likewise.
// horizontalScale     width, marginLeft, marginRight, marginHorizontal, paddingLeft, paddingRight, paddingHorizontal, likewise.
// moderateScale       font-size, borderRadius, likewise.


