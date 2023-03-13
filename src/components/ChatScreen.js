import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { Avatar, Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { Appbar, Text } from 'react-native-paper';
import { stylesheet } from './Styles';
import firestore from '@react-native-firebase/firestore';
import Background from '../assets/background.svg'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ChatScreen = (props) => {

    const [messages, setMessages] = useState([])

    const getAllmessage = async () => {
        const docid = props.route.params.prop.uid > props.user.uid ? props.user.uid + "-" + props.route.params.prop.uid : props.route.params.prop.uid + "-" + props.user.uid
        const querySnapshot = await firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc")
            .get()



        const allMsg = querySnapshot.docs.map(docSnap => {
            return {
                ...docSnap.data()

            }
        })
        setMessages(allMsg)
    }

    useEffect(() => {
        // getAllMessages()

        const docid = props.route.params.prop.uid > props.user.uid ? props.user.uid + "-" + props.route.params.prop.uid : props.route.params.prop.uid + "-" + props.user.uid
        const messageRef = firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc")

        const unSubscribe = messageRef.onSnapshot((querySnap) => {
            const allmsg = querySnap.docs.map(docSanp => {
                const data = docSanp.data()
                if (data.createdAt) {
                    return {
                        ...docSanp.data(),
                        createdAt: data.createdAt.toDate().toString()
                    }
                } else {
                    return {
                        ...docSanp.data(),
                        createdAt: new Date()
                    }
                }

            })
            setMessages(allmsg)
        })


        return () => {
            unSubscribe()
        }


    }, [])

    const onSend = (messages) => {
        const msg = messages[0]
        const mymsg = {
            ...msg,
            sentBy: props.user.uid,
            sentTo: props.route.params.prop.uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
        const docid = props.route.params.prop.uid > props.user.uid ? props.user.uid + "-" + props.route.params.prop.uid : props.route.params.prop.uid + "-" + props.user.uid

        firestore().collection('chatrooms').doc(docid).collection('messages')
            .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() });
    }

    return (
        <View style={stylesheet.chatHomeContainer}>
            <View style={{ position: 'absolute' }}>
                {props.route.params.prop.bgImg ? <Image source={{ uri: props.route.params.prop.bgImg }} style={{ width: windowWidth, height: windowHeight }} /> : <Image source={require('../assets/background.png')} style={stylesheet.backgroundMain} />}
            </View>
            <Appbar style={stylesheet.appbarChat}>
                <Appbar.BackAction onPress={() => props.navigation.navigate('Chats')} />
                <Image source={{ uri: props.route.params.prop.pic }} style={stylesheet.userImg} />
                <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <Appbar.Content title={props.route.params.prop.name} titleStyle={{ fontWeight: '700' }} style={{ marginStart: 5, marginTop: 15 }} />
                    <Text style={{ marginStart: 5.5, marginBottom: 8, fontSize: 10 }}>{
                        typeof (props.route.params.prop.status) == "string" ? props.route.params.prop.status : props.route.params.prop.status.toDate().toString()
                    }</Text>
                </View>
                <Appbar.Action icon="dots-vertical" />
            </Appbar>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                multiline
                user={{
                    _id: props.user.uid,
                }}
                renderBubble={(props) => {
                    return <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                elevation: 5,
                                borderBottomLeftRadius: 15,
                                borderBottomRightRadius: 2,
                                borderTopEndRadius: 15,
                                borderTopLeftRadius: 15,
                            },
                            left: {
                                backgroundColor: 'white',
                                elevation: 5,
                                borderBottomLeftRadius: 2,
                                borderBottomRightRadius: 15,
                                borderTopEndRadius: 15,
                                borderTopLeftRadius: 15
                            }
                        }}
                    />
                }}
                renderInputToolbar={(props) => {
                    return <InputToolbar
                        {...props}
                        primaryStyle={{ borderTopWidth: 0.5, borderTopColor: 'gray', }}
                    />
                }}
            >

            </GiftedChat>
        </View>
    )
}

export default ChatScreen;