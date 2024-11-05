import {StyleSheet, Text, View} from 'react-native';
import {moderateScale} from '../utils/Metrics';
import colors from '../utils/colors';
import FONTS from './fonts';

const ListEmptyComponent = (props: any) => {
  return (
    <View style={[style.emptyContainer,props.style]}>
      <Text style={style.emptyText}>{props.title ? props.title : 'No data found'}</Text>
    </View>
  );
};

export default ListEmptyComponent

const style = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    padding: moderateScale(2),
  },
  emptyText: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.GRAY,
    textAlign:'center'
  },
});
