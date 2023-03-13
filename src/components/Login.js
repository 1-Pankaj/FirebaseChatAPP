import React, { useState } from "react";
import { View, Dimensions, TouchableOpacity, Image } from "react-native";
import { Appbar, Text, TextInput, Button, Modal, Portal, ActivityIndicator, Snackbar } from 'react-native-paper'
import { stylesheet } from "./Styles";
import Background from '../assets/background.svg'
import Google from '../assets/Google.svg';
import Auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = (props) => {

    GoogleSignin.configure({
        webClientId: '99511104204-hrbk67dpv8q7n2dvmk2jlk1gntmsj6lq.apps.googleusercontent.com'
    })

    async function onGoogleButtonPress() {

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        const { idToken } = await GoogleSignin.signIn();

        const googleCredential = Auth.GoogleAuthProvider.credential(idToken);

        const user_signed_in = Auth().signInWithCredential(googleCredential);

        if ((await user_signed_in).additionalUserInfo.isNewUser) {
            user_signed_in.then((user) => {
                console.log(user)
                console.log(user.user.photoURL + "  " + user.user.displayName + "  " + user.user.email)
                console.log("\n" + user.user)
                console.log("\n" + user.user.uid)
                firestore().collection('users').doc(user.user.uid).set({
                    name: user.user.displayName,
                    email: user.user.email,
                    uid: user.user.uid,
                    pic: user.user.photoURL,
                    BackgroundPic: '',

                }).catch((error) => { snackbarSetter(error.message) })
                setModalVisible(false)
                let data = { name: user.user.displayName, email: user.user.email, password: '', uid: user.user.uid }
                setTimeout(() => {
                    props.navigation.navigate('Chats')
                }, 500)
            }).catch((error) => {
                console.log(error)
            })
        }
        else {
            props.navigation.navigate('Chats')
        }


    }
    const navigate = (prop) => {
        props.navigation.navigate(prop)
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarVisibility, setSnackbarVisibility] = useState(false)

    const snackbarSetter = (prop) => {
        setSnackbarMessage(prop),
            setSnackbarVisibility(true)
    }

    const signInUser = async () => {
        setModalVisible(true)
        try {
            if (!email || !password) {
                setModalVisible(false)
            }
            else {
                const result = await Auth().signInWithEmailAndPassword(email, password);
                setModalVisible(false)
                setTimeout(() => {
                    navigate('Chats');
                }, 300)

            }
        }
        catch (error) {
            snackbarSetter("Email or password error!")
            setModalVisible(false)
        }
    }

    return (

        <View style={stylesheet.container}>
            <View style={{ position: 'absolute' }}>
                <Image source={require('../assets/background.png')} style={stylesheet.backgroundMain} />
            </View>
            <View style={{ width: windowWidth }}>
                <Appbar style={{
                    width: windowWidth, height: 100, borderBottomEndRadius: 30,
                    borderBottomLeftRadius: 30, backgroundColor: 'transparent'
                }}>
                    <Appbar.BackAction
                        onPress={() => { navigate('Home') }} />
                </Appbar>
            </View>
            <Text style={{ alignSelf: 'flex-start', marginStart: 20, fontWeight: 'bold', color: '#353535' }}
                variant="headlineLarge">Let's sign you in!</Text>
            <Text variant="bodyLarge"
                style={{
                    fontWeight: 'bold', color: '#656565', paddingRight: 40, marginLeft: 20, marginTop: 20,
                    textAlign: 'left'
                }}>
                Sign in to get access all your previous chats or
                get started!
            </Text>

            <TextInput style={[stylesheet.textinputLogin, { marginTop: 80 }]} label="Email" mode="outlined"
                onChangeText={(emailText) => setEmail(emailText)}
                value={email}
            />
            <TextInput style={[stylesheet.textinputLogin, { marginTop: 15 }]} label="Password" mode="outlined"
                right={<TextInput.Icon icon={passwordVisible ? 'eye' : 'eye-off'}
                    onPress={() => setPasswordVisible(!passwordVisible)} />}
                secureTextEntry={passwordVisible}
                onBlur={() => setPasswordVisible(true)}
                onChangeText={(passwordText) => setPassword(passwordText)}
                value={password}
            />
            <TouchableOpacity style={stylesheet.forgotpassText}
                activeOpacity={0.6}>
                <Text >Forgot password?</Text>
            </TouchableOpacity>
            <Button style={stylesheet.loginButton}
                textColor="white"
                buttonColor="black"
                onPress={() => signInUser()}
                labelStyle={stylesheet.loginLabel}>Login</Button>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ fontSize: 13, color: 'gray' }}>____________________</Text>
                <Text style={{ fontSize: 13, color: 'gray', marginTop: 5 }}>  OR  </Text>
                <Text style={{ fontSize: 13, color: 'gray' }}>____________________</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={() => { onGoogleButtonPress() }}>
                <View style={stylesheet.continueGoogle}>
                    <Google style={{ alignSelf: 'center', marginStart: 30 }} />
                    <Text style={stylesheet.textSigninGoogle}>Sign in with google</Text>
                </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold', color: '#555555', fontSize: 13 }}>Don't have an account?</Text>
                <TouchableOpacity>
                    <Text style={{ fontWeight: '900', color: 'black', fontSize: 13 }}> Sign up</Text>
                </TouchableOpacity>
            </View>
            <Portal>
                <Modal visible={modalVisible}
                    contentContainerStyle={stylesheet.modalContainerLoading}>
                    <ActivityIndicator size="large" color="black" />
                </Modal>
            </Portal>
            <Snackbar visible={snackbarVisibility} onDismiss={() => setSnackbarVisibility(false)}
                action={{ label: 'Dismiss', onPress: () => { setSnackbarVisibility(false) } }}>{snackbarMessage}</Snackbar>
        </View>

    )
}

export default Login;