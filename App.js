import "react-native-gesture-handler"
import "expo-dev-client";
import Navigation from './navigation/Navigation';
import { MyProvider } from './Context';
import messaging from '@react-native-firebase/messaging'
import { useEffect } from 'react';

export default function App() {
  
  useEffect(() => {
    try {
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });
      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
          }
        });

      // Register background handler
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
      });

    } catch (error) {
      console.log(error);
    }

  }, [])




  return (


    <MyProvider>
      <Navigation />
    </MyProvider>

  );
}


