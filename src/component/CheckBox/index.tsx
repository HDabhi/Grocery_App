import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Wrapper, Box, Label} from './styles';
import {moderateScale, verticalScale} from '../../utils/Metrics';
import FONTS from '../fonts';
import colors from '../../utils/colors';

interface CheckBoxProps {
  label: string;
  value?: boolean;
  onChange?: (newValue: boolean) => void;
  checkedColor?: string;
  uncheckedColor?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  value = false,
  onChange,
  checkedColor = '#FF9800',
  uncheckedColor = '#BDBDBD',
}) => {
  const handleChange = () => {
    if (onChange) {
      onChange(!value);
    }
  };

  return (
    <Wrapper style={{marginVertical:verticalScale(6)}}>
      <Box
        checked={value}
        checkedColor={checkedColor}
        uncheckedColor={uncheckedColor}
        onPress={handleChange}>
        {value ? <Icon size={18} name="check" color={checkedColor} /> : null}
      </Box>
      <Label
        style={{
          fontSize: moderateScale(14),
          fontFamily: FONTS.MEDIUM,
          color: colors.BLACK,
        }}>
        {label}
      </Label>
    </Wrapper>
  );
};

export default CheckBox;
