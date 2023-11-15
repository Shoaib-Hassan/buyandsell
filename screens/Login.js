import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { useDataContext } from '../Context';
import { firebase } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import messaging from '@react-native-firebase/messaging'
const Login = ({ navigation }) => {

  const { setCurrentUser, token, setToken } = useDataContext();
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '998966989312-paobt0evvnod69e5lg17qcgb42mtju0f.apps.googleusercontent.com',
    });

    const sub = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    setTimeout(() => {
      autoLogin()
    }, 2000)
    return sub;
  }, []);


  function onAuthStateChanged(user) {
    setCurrentUser(user);

    if (initializing) {
      setInitializing(false);
    }

    if (user) {
      requestUserPermission(user)
      navigation.navigate('TabGroup');
    }
  }
  async function requestUserPermission(user) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging().getToken().then(tok => {
        set(ref(getDatabase(), 'tokens/' + user.uid), {
          email: user.email,
          token: tok
        })
      })

    }
  }

  const signinWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      await AsyncStorage.setItem('userToken', idToken);
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      await firebase.auth().signInWithCredential(googleCredential);


    } catch (error) {
      ToastAndroid.show('Sign in Failed', ToastAndroid.SHORT);
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  };

  const autoLogin = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(userToken);
        await firebase.auth().signInWithCredential(googleCredential);
        navigation.navigate('TabGroup');
      } catch (error) {
        await firebase.auth().signOut();
        await AsyncStorage.removeItem('userToken');
        ToastAndroid.show('Login Failed', ToastAndroid.SHORT);
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 2000)


      }
    }
  };
  const handleTermsPress = () => {
    Linking.openURL('https://pubgmidbuyandsell.blogspot.com/p/terms-and-conditions.html');
  };

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://pubgmidbuyandsell.blogspot.com/p/privacy-policy.html');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={{ fontSize: 30, fontWeight: 900, color: "white", }}>Welcome Back!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ rowGap: 15 }}>
          {loading ? (
            <Button
              onPress={() => {
                signinWithGoogle();
              }}
              icon={<ActivityIndicator size="small" color="white" />}
              buttonStyle={styles.googleButton}
            />

          ) : (
            <Button
              onPress={() => {
                signinWithGoogle();
              }}
              icon={<Image source={require('../assets/google.png')} style={styles.buttonIcon} />}
              title="Continue with Google"
              buttonStyle={styles.googleButton}
            />
          )}

          <Button
            icon={<Image source={require('../assets/guest.png')} style={styles.buttonIcon} />}
            title="Continue as Guest"
            buttonStyle={styles.guestButton}
          />
        </View>
        <View style={{ width: "100%", }}>
          <Text style={{ marginLeft: 10, alignSelf: "center", textAlign: "center", marginTop: 15 }}>
            By clicking Continue with Google, you agree to continue
            <Text style={{ color: 'blue', textDecorationLine: 'underline', }} onPress={handleTermsPress}>
              {' '}Terms of Use
            </Text>{' '}
            and{' '}
            <Text style={{ color: 'blue', textDecorationLine: 'underline', }} onPress={handlePrivacyPolicyPress}>
              Privacy Policy
            </Text>

          </Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  appName: {
    fontSize: 24,
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

  },
  googleButton: {
    backgroundColor: 'black',
    width: 220,
    borderRadius: 5,
    padding: 10

  },
  guestButton: {
    paddingRight: 25,
    backgroundColor: 'black',
    width: 220,
    borderRadius: 5,
    padding: 10
  },
  buttonIcon: {
    marginRight: 10,
    width: 25,
    height: 25
  },
});

export default Login;
