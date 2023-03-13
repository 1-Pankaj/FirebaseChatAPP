import React, { useState } from "react";
import { View, Dimensions, TouchableOpacity, Image } from "react-native";
import {
    Appbar, Button, Checkbox, Snackbar, Text, TextInput,
    ActivityIndicator, Portal, Modal
} from 'react-native-paper'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { stylesheet } from "./Styles";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useNavigation } from "@react-navigation/native";
import Background from '../assets/background.svg';
import Google from '../assets/Google.svg';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Signup = (props) => {

    GoogleSignin.configure({
        webClientId: '99511104204-hrbk67dpv8q7n2dvmk2jlk1gntmsj6lq.apps.googleusercontent.com'
    })

    async function onGoogleButtonPress() {

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        const { idToken } = await GoogleSignin.signIn();

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        const user_signed_in = auth().signInWithCredential(googleCredential);
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
    const navigator = useNavigation();
    const navigate = (prop) => {
        navigator.navigate(prop);
    }

    const [secureText, setSecureText] = useState(true)
    const [checkedState, setCheckedState] = useState(false)
    const [enableButton, setEnablebutton] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarVisibility, setSnackbarVisibility] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const snackbarSetter = (prop) => {
        setSnackbarMessage(prop),
            setSnackbarVisibility(true)
    }

    const signupUser = async () => {
        
        if (!email || !password || !name) {
            snackbarSetter('Please fill all details!')
            
        }
        else{
            setModalVisible(true)
            try {
                const result = await auth().createUserWithEmailAndPassword(email, password)
                firestore().collection('users').doc(result.user.uid).set({
                    name: name,
                    email: result.user.email,
                    uid: result.user.uid,
                    pic: 'https://firebasestorage.googleapis.com/v0/b/rn-chatapp-84977.appspot.com/o/userprofile%2FprofilePIC.png?alt=media&token=49276221-d65a-400a-a1ea-d8eca5f3f136',
                    BackgroundPic: ''
                }).catch((error) => { snackbarSetter(error.message) })
                setModalVisible(false)
                let data = { name: name, email: result.user.email, password: password, uid: result.user.uid }
                setTimeout(() => {
                    props.navigation.navigate('ImagePic', data)
                }, 500)
    
            } catch (error) {
                snackbarSetter(error.message)
                setModalVisible(false)
    
            }
        }
        
    }

    return (

        <View style={stylesheet.container}>
            <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
                <Image source={require('../assets/background.png')} style={stylesheet.backgroundMain} />
            </View>
            <Appbar style={{
                width: windowWidth, height: 100, borderBottomEndRadius: 30,
                borderBottomLeftRadius: 30, backgroundColor: 'transparent'
            }}>
                <Appbar.BackAction
                    onPress={() => { navigate('Home') }} />
            </Appbar>

            <Text style={{ alignSelf: 'flex-start', marginStart: 20, fontWeight: 'bold', color: '#353535' }}
                variant="headlineLarge">Let's get you started!</Text>
            <Text variant="bodyLarge"
                style={{
                    fontWeight: 'bold', color: '#656565', paddingRight: 40, marginLeft: 20, marginTop: 20,
                    textAlign: 'left'
                }}>
                Welcome to Chat Application! Signup with your email password
                or with social media to continue to application!
            </Text>
            <TextInput mode="outlined" label="Name" style={{
                width: windowWidth - 80, backgroundColor: 'lightgray',
                marginTop: 30
            }}
                value={name}
                onChangeText={(nameText) => { setName(nameText) }}
            />
            <TextInput mode="outlined" label="Email" style={{
                width: windowWidth - 80, backgroundColor: 'lightgray',
                marginTop: 10
            }} keyboardType="email-address"
                value={email}
                onChangeText={(emailText) => { setEmail(emailText) }}
            />
            <TextInput mode="outlined" label="Password" style={{
                width: windowWidth - 80, backgroundColor: 'lightgray',
                marginTop: 10
            }} secureTextEntry={secureText} right={<TextInput.Icon icon={secureText ? 'eye' : 'eye-off'}
                onPress={() => setSecureText(!secureText)} />}
                onBlur={() => setSecureText(true)}
                value={password}
                onChangeText={(passwordText) => { setPassword(passwordText) }}
            />
            <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center', marginStart: 40 }}>
                <Checkbox color="black" style={{ marginStart: 30 }}
                    onPress={() => { { setCheckedState(!checkedState) } { setEnablebutton(!enableButton) } }}
                    status={checkedState ? 'checked' : 'unchecked'} />
                <Text style={{
                    textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: '#555555',
                    alignSelf: 'center', marginRight: 20, paddingRight: 30
                }}>
                    I agree to all the terms and conditions
                </Text>
            </View>
            <Button textColor="white" labelStyle={{
                padding: 15, width: windowWidth - 100
            }} buttonColor={enableButton ? 'black' : 'gray'} onPress={() => {
                enableButton ? signupUser() :
                    snackbarSetter('Check all fields')
            }} style={{ marginTop: 10 }} >Register
            </Button>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ fontSize: 13, color: 'gray' }}>____________________</Text>
                <Text style={{ fontSize: 13, color: 'gray', marginTop: 5 }}>  OR  </Text>
                <Text style={{ fontSize: 13, color: 'gray' }}>____________________</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={() => onGoogleButtonPress()}>
                <View style={stylesheet.continueGoogle}>
                    <Google style={{ alignSelf: 'center', marginStart: 30 }} />
                    <Text style={stylesheet.textSigninGoogle}>Sign in with google</Text>
                </View>
            </TouchableOpacity>
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

export default Signup;