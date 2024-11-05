import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import { useAuth } from '../stores/auth';
import notifee, { EventType,AndroidImportance } from '@notifee/react-native'; // For foreground notifications
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestNotificationPermission = async () => {
  // For Android 13 and above
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (result === RESULTS.GRANTED) {
      console.log('Notification permission granted.');
      await requestUserPermission();
    } else if (result === RESULTS.DENIED) {
      console.log('Notification permission denied.');
      Alert.alert('Permission Denied', 'You need to enable notifications for a better experience.');
    } else if (result === RESULTS.BLOCKED) {
      console.log('Notification permission blocked.');
      Alert.alert('Permission Blocked', 'Go to settings and manually enable notifications.');
    }
  } else {
    // For Android versions below 13 and iOS
    await requestUserPermission();
  }
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

const getFcmTokenFromLocalStorage = async () => {
  const {fcmToken} = useAuth.getState()
  console.log("FCM Token :: " + fcmToken)
  const {changeFcmToken} = useAuth.use.actions()
  if (!fcmToken) {
    console.log("newFcmToken")
    try {
      const newFcmToken = await messaging().getToken();
      console.log("newFcmToken Token :: " + newFcmToken)
      changeFcmToken(newFcmToken)
    } catch (error) {
      console.log("Error token : " + error)
      console.error(error);
    }
  } else {
    console.log('token found', fcmToken);
  }
};
const getFcmToken = async () => {
  try {
    const newFcmToken = await messaging().getToken();
    return newFcmToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const notificationListener = (navigationRef) => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      JSON.stringify(remoteMessage) ,
    );

    navigationRef.current?.navigate('OrderDetails',{orderId: remoteMessage?.data?.orderId});
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        navigationRef.current?.navigate('OrderDetails',{orderId: remoteMessage?.data?.orderId});
      }
    })
    .catch(error => console.log('failed', error));

  messaging().onMessage(async remoteMessage => {
    console.log("remoteMessage : " + JSON.stringify(remoteMessage))
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    if (remoteMessage?.notification) {
      await displayForegroundNotification(remoteMessage);
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
      console.log('User pressed on the notification in foreground:', JSON.stringify(detail) );
      
      handleNotificationClick(detail.notification.data, navigationRef);
    }
  });
};

const handleNotificationClick = (remoteMessage, navigationRef) => {
  if (remoteMessage?.orderId) {
    navigationRef.current?.navigate('OrderDetails', { orderId: remoteMessage.orderId });
  }
};

// Function to display local notification when app is in foreground
async function displayForegroundNotification(remoteMessage) {
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    data : remoteMessage.data,
    android: {
      channelId: 'default',  // You need to create this channelId in your app
      smallIcon: 'ic_notification', 
      importance: AndroidImportance.HIGH,
    },
  });
}

// Call this once, typically in your App.js or in the NotificationProvider to create notification channels
export async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

export {
  getFcmToken,
  getFcmTokenFromLocalStorage,
  requestUserPermission,
  notificationListener,
  requestNotificationPermission
};