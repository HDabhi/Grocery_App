import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Metrics';
import FONTS from './fonts';
import colors from '../utils/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.defaultButtonStyle,
        buttonStyle,            
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.defaultTextStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultButtonStyle: {
    backgroundColor: '#25901B',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  defaultTextStyle: {
    color: '#fff',             
    fontSize: moderateScale(14),
    fontFamily: FONTS.SEMI_BOLD    
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
});

export default CustomButton;