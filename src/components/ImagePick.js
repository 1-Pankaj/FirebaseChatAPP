import React, { useState } from "react";

import { View, Image, TouchableOpacity, } from "react-native";
import { Button, Modal, Text, Portal, Divider } from "react-native-paper";
import { stylesheet } from "./Styles";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Profile from '../assets/profilePic.svg'
import DocumentPicker from 'react-native-document-picker';

const ImagePick = (props) => {
    
    const [imgUrl, setImgUrl] = useState('');
    const [image, setImage] = useState('');
    const [imageButton, setImageButton] = useState('Pick an image');
    console.log(props.route.params.uid)

    const pickImageAndUpload = async () => {
        if (imageButton == 'Pick an image') {
            const response = await DocumentPicker.pickSingle({
                type : [DocumentPicker.types.images],
                copyTo : "cachesDirectory"
            })

            if(response){
                console.log(response.fileCopyUri)
                const file = response.fileCopyUri
                setImage(file)
                const random = Date.now()

                const uploadTask = storage().ref().child(`/userprofile/${random}`).putFile(file);

                        uploadTask.on('state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                                if (progress === 100) {
                                    setModalVisible(true)
                                    setImageButton('Continue to App')

                                }
                            },
                            (error) => {
                                console.log(error.message)
                            }, () => {
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    setImgUrl(downloadURL)
                                    console.log(downloadURL)
                                    firestore().collection('users').doc(props.route.params.uid).update({
                                        pic: downloadURL
                                    })
                                });
                            }
                        );
                    }
            
            else{
                null
            }
        }
        else{
            props.navigation.navigate('Chats')
        }

    }
/**
 * 
 * const file = fileobj.assets;
                    const fileUri = file.forEach((itr) => { return itr.uri, setImage(itr.uri) })
                    
                    if (fileobj.didCancel) { null }
                    else if (!fileobj.didCancel) {

                        const uploadTask = storage().ref().child(`/userprofile/${random}`).putFile(image);

                        uploadTask.on('state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                                if (progress === 100) {
                                    setModalVisible(true)
                                    setImageButton('Continue to App')

                                }
                            },
                            (error) => {
                                console.log(error.message)
                            }, () => {
                                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    setImgUrl(downloadURL)
                                    console.log(downloadURL)
                                    firestore().collection('users').doc(props.route.params.uid).update({
                                        pic: downloadURL
                                    })
                                });
                            }
                        );
                    }
 */
    const [modalVisible, setModalVisible] = useState(false)
    return (
        <View style={stylesheet.container}>
            <View style={{ position: 'absolute' }}>
                <Image source={require('../assets/background.png')} style={stylesheet.backgroundMain}/>
            </View>

            <View style={stylesheet.roundBg}>

                {image ? imgUrl ? <Image style={stylesheet.imageProfile} source={{ uri: imgUrl }} /> : null : <TouchableOpacity activeOpacity={0.6}
                    onPress={() => pickImageAndUpload()}>
                    <Profile style={{ marginStart: 30, marginTop: 20 }} />
                </TouchableOpacity>}
            </View>
            <Text style={stylesheet.chooseText}>Choose Photo</Text>
            <Text style={stylesheet.descTextImage}>Pick a photo from your gallery which you want to
                use as profile picture in this application!</Text>

            <Button labelStyle={stylesheet.imageLabel}
                buttonColor="black"
                textColor="white"
                style={{ marginTop: 50 }}
                onPress={() => pickImageAndUpload()}>
                {imageButton}
            </Button>
            <TouchableOpacity style={stylesheet.skipButton} onPress={()=>props.navigation.navigate('Chats')}>
                <Text style={stylesheet.skipText}>Skip for now</Text>
            </TouchableOpacity>
            <Text style={stylesheet.changeLaterText}>You can change this later using the profile tab!</Text>
            <Text style={stylesheet.termsText}>By uploading an image you agree to our terms and conditions</Text>
            <Portal>
                <Modal visible={modalVisible}
                    contentContainerStyle={stylesheet.modalContainer}>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={stylesheet.alertText}>Alert!</Text>
                        <Divider style={{ width: '100%', height: 1.5, marginTop: 5 }}></Divider>
                    </View>
                    <Text
                        style={stylesheet.modaltext}
                        variant="titleLarge">Profile picture upload successful!
                    </Text>
                    <TouchableOpacity style={{ width: '100%', alignItems: 'center' }}
                        activeOpacity={0.6} onPress={() => setModalVisible(false)}>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <Divider style={{ width: '100%', height: 1.5, marginBottom: 7 }}></Divider>
                            <Text style={stylesheet.okayText}>OKAY</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </Portal>
        </View>
    )
};

export default ImagePick;