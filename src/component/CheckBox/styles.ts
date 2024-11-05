import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface BoxProps {
  checked: boolean;
  checkedColor: string;
  uncheckedColor: string;
}

export const Box = styled.TouchableOpacity<BoxProps>`
  width: 22px;
  height: 22px;

  border-width: 2px;
  border-radius: 8px;
  border-color: ${({checked, checkedColor, uncheckedColor}) =>
    checked ? checkedColor : uncheckedColor};
`;

export const Label = styled.Text`
  color: #000;
  margin-left: 8px;
`;