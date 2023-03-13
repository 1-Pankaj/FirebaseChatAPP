import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { stylesheet } from "./Styles";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Appbar, Text, TextInput, List, Divider, Portal, Modal, ActivityIndicator, Menu, } from "react-native-paper";
import DocumentPicker from 'react-native-document-picker'

const Profile = ({ user, navigation }) => {

    const [modalLoad, setModalLoad] = useState(false)
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);
    const [userData, setUserData] = useState('')

    const getUserData = async () => {
        await firestore().collection('users').
            doc(auth().currentUser.uid).
            get().then((data) => { setUserData(data.data()) })
    }

    const pickImageAndUpload = async () => {
        closeMenu()
        const response = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
            copyTo: "cachesDirectory"
        })

        if (response) {
            setModalLoad(true)
            console.log(response.fileCopyUri)
            const file = response.fileCopyUri
            const random = Date.now()

            const uploadTask = storage().ref().child(`/userprofile/${random}`).putFile(file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    if (progress === 100) {


                    }
                },
                (error) => {
                    console.log(error.message)
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        setModalLoad(false)
                        console.log(downloadURL)
                        firestore().collection('users').doc(userData.uid).update({
                            pic: downloadURL
                        })
                    });
                }
            );
        }

        else {
            setModalLoad(false)
        }



    }

    const defaultImage = () => {
        firestore().collection('users').doc(userData.uid).update({
            pic: 'https://firebasestorage.googleapis.com/v0/b/rn-chatapp-84977.appspot.com/o/userprofile%2FprofilePIC.png?alt=media&token=49276221-d65a-400a-a1ea-d8eca5f3f136'
        })
        closeMenu()
    }

    useEffect(() => {
        getUserData()
    }, [])


    return (
        <View style={stylesheet.container}>
            <View style={{ position: 'absolute' }}>
                <Image source={require('../assets/background.png')} />
            </View>
            <Appbar style={stylesheet.appBarProfile}>
                <Appbar.BackAction onPress={() => { navigation.navigate('Chats') }} />
                <Appbar.Action icon="dots-vertical" onPress={() => { }} />
            </Appbar>

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={stylesheet.profilePic}>
                    {userData ?
                        <Image source={{ uri: userData.pic }} style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                        : null}
                </View>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<TouchableOpacity activeOpacity={0.6} onPress={() => { openMenu() }}>
                        <Text style={stylesheet.changeProfileText}>
                            Change profile image
                        </Text>
                    </TouchableOpacity>}>
                    <Menu.Item title="Change photo" onPress={() => pickImageAndUpload()} />
                    <Menu.Item title="Remove photo" onPress={() => defaultImage()} />
                </Menu>
                <TextInput label="Name" mode="outlined" style={[stylesheet.textinputProfile, { marginTop: 30 }]}
                    value={userData.name} editable={false} />
                <TextInput label="Email" mode="outlined" style={[stylesheet.textinputProfile, { marginTop: 10 }]}
                    value={userData.email} editable={false} />
                <List.Section style={{ width: '90%' }}>
                    <List.Subheader >Notifications</List.Subheader>

                    <List.Item
                        title="Change notifications settings"
                        style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}
                        left={() => <List.Icon color="gray" icon="bell-ring-outline" />}
                        onPress={() => { }}
                    />
                </List.Section>
                <List.Section style={{ width: '90%' }}>
                    <List.Subheader>Profile settings</List.Subheader>
                    <List.Item
                        title="Change email or password"
                        style={{
                            padding: 10, backgroundColor: 'white',
                            borderTopLeftRadius: 10, borderTopRightRadius: 10
                        }}
                        onPress={() => { }}
                        left={() => <List.Icon icon="email-edit-outline" color="gray" />}
                    />
                    <Divider />
                    <List.Item
                        title="Change user name"
                        left={() => <List.Icon icon="account-edit-outline" color="gray" />}
                        style={{ padding: 10, backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                        onPress={() => { }}
                    />
                </List.Section>
                <List.Section style={{ width: '90%' }}>
                    <List.Subheader>Profile deletion</List.Subheader>
                    <List.Item
                        title="Request profile deletion"
                        style={{
                            padding: 10, backgroundColor: 'white',
                            borderTopLeftRadius: 10, borderRadius: 10
                        }}
                        onPress={() => { }}
                        left={() => <List.Icon icon="account-cancel-outline" color="gray" />}
                    />
                </List.Section>
                <List.Section style={{ width: '90%', marginBottom: 20 }}>
                    <List.Subheader>Logout</List.Subheader>
                    <List.Item
                        title="Logout"
                        style={{
                            padding: 10, backgroundColor: 'white',
                            borderTopLeftRadius: 10, borderRadius: 10
                        }}
                        onPress={() => {
                            Alert.alert('Logout', 'Are you sure to logout?',
                                [{
                                    text: 'okay', onPress: () => {
                                        firestore().collection('users')
                                            .doc(userData.uid).update({
                                                status: firestore.FieldValue.serverTimestamp()
                                            })
                                        auth().signOut()
                                    }
                                },
                                { text: 'cancel', style: 'cancel' }])
                        }}
                        left={() => <List.Icon icon="logout" color="gray" />}
                    />
                </List.Section>
                <Portal>
                    <Modal visible={modalLoad}
                        contentContainerStyle={stylesheet.modalContainerLoading}>
                        <ActivityIndicator size="large" color="black" />
                    </Modal>
                </Portal>
            </ScrollView>
        </View>
    )
}

export default Profile