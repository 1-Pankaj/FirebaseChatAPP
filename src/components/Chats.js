import React, { useState, useEffect } from "react";
import { View, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
import auth from '@react-native-firebase/auth';
import { Appbar, Text, Tooltip, IconButton, Portal, FAB, Modal, Menu, ActivityIndicator, Divider, Searchbar } from "react-native-paper";
import { stylesheet } from "./Styles";
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from "react-native-image-picker";
import Background from '../assets/background.svg'
import storage from '@react-native-firebase/storage'
import { SearchBar } from "react-native-screens";
import DocumentPicker from 'react-native-document-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Chats = ({ user, navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [searchText, setSearchText] = useState('')
  const [searchModal, setSearchModal] = useState(false)
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const [allUserData, setAllUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisibleUpload, setModalVisibleUpload] = useState(false)
  const [imgURL, setImgURL] = useState(null)
  const [bgimgURL, setBGImgURL] = useState(null)
  const getUsers = async () => {
    const querySnapshot = await firestore().collection('users').where('uid', '!=', user.uid).get();
    const allUsers = querySnapshot.docs.map(docSnap => docSnap.data());
    setAllUser(allUsers);
    const backgroundImgData = await firestore().collection('users').where("uid", "==", user.uid).get();
    backgroundImgData.forEach((data) => { setBGImgURL(data.data().BackgroundpPic) })
  }

  useEffect(() => {
    getUsers()
  }, [])
  const [imgUrl, setImgUrl] = useState('');
  const [image, setImage] = useState('');
  const [modalLoad, setModalLoadVisible] = useState(false)
  const uploadBackground = async () => {



    const response = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.video],
      copyTo: "cachesDirectory"
    })
    if (response) {
      setModalLoadVisible(true)
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
          console.log(error)
          setModalLoadVisible(false)
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setBGImgURL(downloadURL)
            setModalLoadVisible(false)
            setModalVisibleUpload(true)
            console.log(downloadURL)
            firestore().collection('users').doc(user.uid).update({
              BackgroundpPic: downloadURL
            })
          });
        }
      );

    }
    else {
      setModalLoadVisible(false)
    }
  }

  const defaultBackground = () => {
    setBGImgURL('')
    firestore().collection('users').doc(user.uid).update({
      BackgroundPic: ''
    })
  }
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const checkImage = (imageUrl) => {
    setModalVisible(true)
    setImgURL(imageUrl)
  }

  const redirectChat = (prop) => {
    navigation.navigate('ChatScreen', { prop })
  }

  const RenderItem = ({ item }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => redirectChat({
          name: item.name, uid: item.uid, pic: item.pic, status: item.status, bgImg: bgimgURL
        })}>
          <View style={stylesheet.chatCard}>
            <TouchableOpacity onPress={() => checkImage(item.pic)}>
              <Image source={{ uri: item.pic }} style={stylesheet.profileImageChats} />
            </TouchableOpacity>
            <View>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 20,
                marginStart: 20,
              }}>
                {item.name}
              </Text>
              <Text style={{
                fontSize: 12,
                marginStart: 20,
                fontWeight: 'bold',
                color: '#959595',
                marginTop: 5
              }}>
                {item.email}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={stylesheet.chatHomeContainer}>
      <View style={{ position: 'absolute' }}>
        {bgimgURL ? <Image source={{ uri: bgimgURL }} style={{ width: windowWidth, height: windowHeight }} /> : <Image source={require('../assets/background.png')} style={stylesheet.backgroundMain} />}
      </View>
      <Appbar style={stylesheet.appBar}>
        <Tooltip title="back">
          <Appbar.BackAction onPress={() => { }} />
        </Tooltip>
        <Appbar.Content title="Chats" subtitle="title" />
        <Tooltip title="search">
          <Appbar.Action icon="magnify" onPress={() => { setSearchModal(true) }} />
        </Tooltip>


        <Menu
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{ backgroundColor: 'white' }}
          anchor={<IconButton icon="dots-vertical" selected size={24} onPress={() => openMenu()} />}>
          <Menu.Item onPress={() => {
            navigation.navigate('Profile')
            closeMenu()
          }} title="Profile" />
          <Menu.Item onPress={() => {
            uploadBackground()
            closeMenu()
          }} title="Change background" />
          <Menu.Item onPress={() => {
            defaultBackground()
            closeMenu()
          }} title="Default background" />
          <Menu.Item onPress={() => {
            firestore().collection('users')
              .doc(user.uid).update({
                status: firestore.FieldValue.serverTimestamp()
              })
            auth().signOut()
            closeMenu()
          }} title="Logout" />
        </Menu>
      </Appbar>
      <Portal>
        <Modal visible={searchModal}
          onDismiss={() => setSearchModal(false)}>
          <Searchbar style={{ width: windowWidth - 50, alignSelf: 'center', marginTop: 10 }}
            placeholder="Search here..."
            value={searchText}
            onChangeText={(text) => { setSearchText(text) }}
            onBlur={() => { }}
          />
        </Modal>
      </Portal>
      <FlatList
        data={allUserData}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item.uid}
      />



      <FAB.Group
        color="white"
        open={open}
        visible
        fabStyle={{ backgroundColor: 'black' }}
        icon={open ? 'chat-remove' : 'chat-processing'}
        actions={[
          {
            icon: 'account-group',
            label: 'Create Group',
            color: 'white',
            style: { backgroundColor: 'black' },
            onPress: () => console.log('Pressed email'),
          },
          {
            icon: 'chat-plus',
            label: 'New Chat',
            color: 'white',
            style: { backgroundColor: 'black' },
            onPress: () => console.log('Pressed notifications'),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
          }
        }}
      />
      <Portal>
        <Modal visible={modalVisible}
          contentContainerStyle={stylesheet.modalContainerImage}
          onDismiss={() => setModalVisible(false)}>
          {imgURL ? <Image source={{ uri: imgURL }} style={{ width: '95%', height: '95%', borderRadius: 20 }} /> : null}
        </Modal>
      </Portal>
      <Portal>
        <Modal visible={modalLoad}
          contentContainerStyle={stylesheet.modalContainerLoading}>
          <ActivityIndicator size="large" color="black" />
        </Modal>
      </Portal>

      <Portal>
        <Modal visible={modalVisibleUpload}
          contentContainerStyle={stylesheet.modalContainer}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={stylesheet.alertText}>Alert!</Text>
            <Divider style={{ width: '100%', height: 1.5, marginTop: 5 }}></Divider>
          </View>
          <Text
            style={stylesheet.modaltext}
            variant="titleLarge">Image upload successful!
          </Text>
          <TouchableOpacity style={{ width: '100%', alignItems: 'center' }}
            activeOpacity={0.6} onPress={() => setModalVisibleUpload(false)}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Divider style={{ width: '100%', height: 1.5, marginBottom: 7 }}></Divider>
              <Text style={stylesheet.okayText}>OKAY</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  )
}

export default Chats;