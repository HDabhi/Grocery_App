import React from 'react';
import {Text, StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import { moderateScale } from '../utils/Metrics';

interface CustomTextProps {
  children: React.ReactNode; // Text content or other elements inside the text
  textStyle?: TextStyle; // Optional custom text style
  numberOfLines?: number; // Optional prop to limit the number of lines
  enable?: boolean;
  onPress?: () => void;
  viewStyle? : ViewStyle
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  textStyle,
  numberOfLines,
  enable = false,
  viewStyle,
  onPress
}) => {
  return (
    <TouchableOpacity style={viewStyle} onPress={onPress} disabled={!enable}>
      <Text
        style={[styles.defaultTextStyle, textStyle]}
        numberOfLines={numberOfLines}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultTextStyle: {
    fontSize: moderateScale(16),
    // color: '#333',
  },
});

export default CustomText;
