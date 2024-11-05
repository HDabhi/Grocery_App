import React, {FC, ReactNode} from 'react';
import {Platform, SafeAreaView, StatusBar} from 'react-native';
import { verticalScale } from './Metrics';
import colors from './colors';

const styles = {
  androidPadding: {
    flex:1,
    padding: Platform.OS === 'android' ? StatusBar?.currentHeight - verticalScale(10) : undefined,

  },

};

export const MultiPlatformSafeAreaView: FC<{
  children: ReactNode;
}> = ({children}) => {
  return (
    <SafeAreaView style={[styles.androidPadding,{backgroundColor:colors.WHITE}]}>{children}</SafeAreaView>
  );
};
