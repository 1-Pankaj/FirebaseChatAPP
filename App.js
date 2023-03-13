import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Button, MD3LightTheme as DefaultTheme, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import HomeScreen from "./src/components/HomeScreen";
import Login from './src/components/Login';
import Signup from './src/components/Signup';
import { StatusBar, View, Image } from 'react-native';
import ImagePick from './src/components/ImagePick';

import Auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Chats from './src/components/Chats';
import ChatScreen from './src/components/ChatScreen';
import Profile from './src/components/Profile';
import { useNetInfo } from '@react-native-community/netinfo';
import { stylesheet } from './src/components/Styles';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    secondary: 'black',
  },
};

const Stack = createNativeStackNavigator();

function App() {

  const netinfo = useNetInfo();
  
  GoogleSignin.configure({
    webClientId:'99511104204-hrbk67dpv8q7n2dvmk2jlk1gntmsj6lq.apps.googleusercontent.com'
  })
  const [user, setUser] = useState('')
  useEffect(() => {
    const unregister = Auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist)
        firestore().collection('users')
          .doc(userExist.uid)
          .update({
            status: "online"
          })
      }
      else setUser("")
    })

    return () => {
      unregister()
    }
  }, [])

  
  
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle='light-content' backgroundColor="black" showHideTransition={'fade'} hidden={false} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ?
            <>
              <Stack.Screen name="Chats" >
                {props => <Chats {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="ChatScreen" options={({ route }) => ({ title: route.params.name })}>
                {props => <ChatScreen {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="Profile" >
                {props => <Profile {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="ImagePic" component={ImagePick} />
            </>
            :
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              

            </>
          }
        </Stack.Navigator>
      </NavigationContainer>
      
      <Portal>
        <Modal
          visible={!netinfo.isConnected}
          style={{ width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
            <View style={stylesheet.modalView}>
              <Image source={require('./src/assets/nointernet.png')} style={stylesheet.imageModal}/>
              <Button onPress={()=>{}} mode="outlined" style={{marginTop:20}}>Refresh</Button>
            </View>
          </Modal>
      </Portal>
    </PaperProvider>
  );
}

export default App;