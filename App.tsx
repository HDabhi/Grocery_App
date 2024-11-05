/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from 'react-native-splash-screen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import FONTS from './src/component/fonts';
import RootNavigation from './src/navigation/rootNavigation';
import colors from './src/utils/colors';
import { moderateScale } from './src/utils/Metrics';
import { queryClient } from './src/utils/query-client';

import { navigationRef } from './src/navigation/rootNavigation';
import { useAuth } from './src/stores/auth';
import {
  createNotificationChannel,
  getFcmToken,
  getFcmTokenFromLocalStorage,
  notificationListener,
  requestNotificationPermission
} from './src/utils/notifications';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const {fcmToken, userId} = useAuth.getState();
  const {changeFcmToken} = useAuth.use.actions();
  const [generatedToken, setGeneratedToken] = useState<string>();

  useEffect(() => {
    console.log('storage', fcmToken, 'newly generated', generatedToken);
  }, [fcmToken, generatedToken]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getFcmToken();
      console.log('FCM token <><><><><> : ' + JSON.stringify(token));
      if (token) {
        setGeneratedToken(token);
        setTimeout(() => {
          changeFcmToken(token);
        }, 100);
      }
    };
    const fetchTokenByLocal = async () => {
      await getFcmTokenFromLocalStorage();
    };
    void fetchToken();
    void fetchTokenByLocal();
    void requestNotificationPermission();
    void createNotificationChannel();
    void notificationListener(navigationRef);
  }, []);

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: colors.GREEN}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: moderateScale(14),
          fontFamily: FONTS.SEMI_BOLD,
          color: colors.BLACK,
        }}
        text2Style={{
          fontSize: moderateScale(13),
          fontFamily: FONTS.MEDIUM,
          color: colors.GRAY,
        }}
        text1NumberOfLines={2}
        text2NumberOfLines={2}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: props => (
      <ErrorToast
        {...props}
        style={{borderLeftColor: colors.RED}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: moderateScale(14),
          fontFamily: FONTS.SEMI_BOLD,
          color: colors.BLACK,
        }}
        text2Style={{
          fontSize: moderateScale(13),
          fontFamily: FONTS.MEDIUM,
          color: colors.GRAY,
        }}
        text1NumberOfLines={3}
        text2NumberOfLines={3}
      />
    ),
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={[{flex: 1}, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
      <Toast config={toastConfig} autoHide />
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
