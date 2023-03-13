import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const stylesheet = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
    },
    continueGoogle: {
        flexDirection: 'row',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        width: windowWidth - 80,
        height: 65,
        marginTop: 15,
        alignItems: 'center'
    },
    textSigninGoogle: {
        fontWeight: 'bold',
        marginStart: 40,
        fontSize: 16
    },
    modalContainer: {
        alignSelf: 'center',
        backgroundColor: 'white',
        width: 250,
        height: 250,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modaltext: {
        fontWeight: 'bold',
        color: '#353535',
        textAlign: 'center',
        alignSelf: 'center'
    },
    alertText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5
    },
    okayText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5
    },
    roundBg: {
        borderRadius: 150,
        width: 170,
        height: 170,
        backgroundColor: 'white',
        marginTop: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    chooseText: {
        fontSize: 40,
        color: '#353535',
        fontWeight: '700',
        marginTop: 40
    },
    descTextImage: {
        paddingHorizontal: 30,
        marginTop: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#353535'
    },
    imageLabel: {
        fontWeight: 'bold',
        width: windowWidth - 150,
        padding: 15,
    },
    skipText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    skipButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth - 130,
        height: 60,
        borderWidth: 1,
        borderRadius: 15,
        marginTop: 35
    },
    changeLaterText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#555555',
        marginTop: 30
    },
    termsText: {
        paddingHorizontal: 50,
        textAlign: 'center',
        fontSize: 14,
        color: '#757575',
        fontWeight: 'bold',
        marginTop: 50
    },
    imageProfile: {
        width: '100%',
        height: '100%',
        borderRadius: 150
    },
    modalContainerLoading: {
        alignSelf: 'center',
        backgroundColor: 'white',
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textinputLogin: {
        width: windowWidth - 80,
        alignSelf: 'center',
        backgroundColor: 'lightgray',
    },
    loginButton: {
        marginTop: 60
    },
    loginLabel: {
        width: windowWidth - 100,
        padding: 15
    },
    forgotpassText: {
        alignSelf: 'flex-end',
        marginRight: 42,
        marginTop: 10
    },
    chatHomeContainer: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    appBar: {
        height: 100,
        borderBottomEndRadius: 30,
        backgroundColor: 'white',
        borderBottomStartRadius: 30,
    },
    header: {
        alignSelf: 'center'
    },
    chatCard: {
        width: windowWidth - 40,
        height: 90,
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileImageChats: {
        width: 50,
        height: 50,
        borderRadius: 30,
        alignSelf: 'flex-start',
        marginStart: 20
    },
    modalContainerImage: {
        alignSelf: 'center',
        backgroundColor: 'white',
        width: 300,
        height: 300,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    appbarChat: {
        height: 70,
        backgroundColor: 'white',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30
    },
    userImg: {
        width: 50,
        height: 50,
        borderRadius: 40
    },
    backgroundMain: {
        width: windowWidth + 20,
        height: windowHeight + 20
    },
    appBarProfile: {
        width: windowWidth,
        height: 90,
        backgroundColor: 'transparent',
        justifyContent: 'space-between'
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: 'white',
        elevation: 15
    },
    changeProfileText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10
    },
    textinputProfile: {
        width: windowWidth - 80,
        alignSelf: 'center',
        backgroundColor: '#ececec',
    },
    loginBTN: {
        width: 100,
        padding: 19,
        borderRadius: 20
    },
    signupBTN: {
        width: 100,
        padding: 20,
        borderRadius: 20
    },
    modalView:{
        alignItems:'center',
        backgroundColor:'white',
        width:windowWidth-100,
        height:windowHeight-400,
        borderRadius:20,
        elevation:10
    },
    imageModal:{
        width:'100%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    }
});
