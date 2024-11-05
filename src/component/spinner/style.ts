import { StyleSheet } from 'react-native';
import { moderateScale } from '../../utils/Metrics';
import colors from '../../utils/colors';

const transparent = 'transparent';
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1
  },
  background: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  container: {
    backgroundColor: transparent,
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  textContainer: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  textContent: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    height: 50,
    top: 80,
    color:colors.GREEN
  }
});

export default styles;