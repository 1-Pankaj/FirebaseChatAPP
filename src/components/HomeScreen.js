import React from "react";
import { View, Animated, PanResponder, Dimensions, Image, TouchableOpacity, TouchableHighlight, Pressable } from "react-native";
import { Button, Provider as PaperProvider, Text } from 'react-native-paper';
import { stylesheet } from "./Styles";
import Background from '../assets/background.svg'
import Logo from '../assets/logo.svg'
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;


const HomeScreen = () => {

    const navigator = useNavigation();
    const navigate = (prop) => {
        navigator.navigate(prop);
    }

    return (

        <View style={stylesheet.container}>
            <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
                <Image source={require('../assets/background.png')} style={stylesheet.backgroundMain} />
            </View>
            <View style={{ marginTop: 50 }}>
                <Logo width={200} height={200} />
            </View>
            <View>
                <Text variant="headlineSmall" style={{
                    textAlign: 'center',
                    fontWeight: 'bold', color: '#353535'
                }}>Welcome to Chat Application!</Text>
                <Text variant="bodyLarge" style={{
                    marginTop: 20, paddingLeft: 20, paddingRight: 20,
                    textAlign: 'center', fontWeight: 'bold',
                    color: '#656565'
                }}>Bring together people with this realtime cross platform chat application with great
                    features and UI built in React Native!</Text>
            </View>
            <View>
                <Text variant="titleLarge" style={{
                    fontWeight: 'bold', color: '#353535', marginRight: 120, marginTop: 150
                }}>Let's Get you started!</Text>

            </View>
            <View style={{
                alignItems: 'center',
                width: windowWidth, marginTop: 30,
                flexDirection: 'row', height: 95, justifyContent: 'space-evenly'
            }}>
                <Button mode="contained" labelStyle={stylesheet.signupBTN} onPress={() => { navigate('Signup') }}>Signup</Button>
                <Button mode="outlined" labelStyle={[stylesheet.loginBTN]} onPress={() => { navigate('Login') }}>Login</Button>
            </View>
            <Text style={{
                marginTop: 10, textAlign: 'center',
                paddingHorizontal: 30, fontWeight: 'bold', color: '#353535'
            }}>Swipe left a little to open signup screen or swipe right to open login screen!</Text>
        </View>

    )
}

export default HomeScreen