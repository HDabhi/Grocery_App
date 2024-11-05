import React from 'react';
import {
  type StyleProp,
  type ViewStyle,
  type ViewProps,
  type ImageSourcePropType,
  Image,
  StyleSheet,
} from 'react-native';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
import type {AnimateProps} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import {SBImageItem} from './SBImageItem';
import {SBTextItem} from './SBTextItem';

interface Props extends AnimateProps<ViewProps> {
  style?: StyleProp<ViewStyle>;
  index?: number;
  pretty?: boolean;
  showIndex?: boolean;
  img?: string;
}

export const SBItem: React.FC<Props> = props => {
  const {
    style,
    showIndex = true,
    index,
    pretty,
    img,
    testID,
    ...animatedViewProps
  } = props;
  const enablePretty = false;
  const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);
  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty);
      }}>
      <Animated.View testID={testID} style={{flex: 1}} {...animatedViewProps}>
        <Image key={index} style={styles.image} source={{uri: img}} />
        {/* <SBImageItem style={style} index={index} showIndex={typeof index === "number" && showIndex} img={img} /> */}
        {/* {isPretty || img
          ? (
            
          )
          : (
            <SBTextItem style={style} index={index} />
          )} */}
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode:'cover'
    // position: 'absolute',
  },
});
