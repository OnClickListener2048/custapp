/**
 * Created by zhuangzihao on 2018/4/17.
 */
/**
 * 图片预览
 * Created by jiaxueting on 2017/8/8.
 */

import React, { Component ,PropTypes} from 'react';
import {
    View,
    Text,
    Platform,
    Image,
    StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper';

import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../config';
import * as WeChat from'react-native-wechat'

import BComponent from '../base/BComponent'
import ImageLoad from "../view/ImageLoad";
import fs from 'react-native-fs';

export default class ShowPhotoPage extends BComponent{
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    constructor(props){
        super(props)
        this.index = props.index

    }
    static defaultProps = {
        index:0,//
        imageArr:[]
    };
    componentWillMount() {

        this.initNavigator()

    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event)
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'share') { // this is the same id field from the static navigatorButtons definition
                let img =this.props.imageArr[this.index]['receiptPath']
                img = encodeURI(img)
                console.log(img)
                console.log(fs.ExternalDirectoryPath)
                let rootPath = Platform.OS === 'ios'? fs.DocumentDirectoryPath: fs.ExternalDirectoryPath;
                let savePath = rootPath + '/voucher-photo.png';
                console.log(savePath);
                const options = {
                    fromUrl: img,
                    toFile: savePath,
                    background: true,
                    begin: (res) => {
                        console.log('***11begin', res);
                        console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                    },
                    progress: (res) => {

                        let pro = res.bytesWritten / res.contentLength;

                        console.log(pro)
                    }

                };
                const ret = fs.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);

                    console.log('file://' + savePath)

                    if(Platform.OS === 'ios'){
                        WeChat.shareToSession({
                            type: 'imageFile',
                            imageUrl:'file://' + savePath
                        }).catch((error) => {
                            // alert(error.message);
                            console.log('share error',error)
                        });
                    }else{
                        WeChat.shareToSession({
                            type: 'file',
                            title: '记账凭证', // WeChat app treat title as file name
                            description: '记账凭证',
                            mediaTagName: 'photo',
                            messageAction: undefined,
                            messageExt: undefined,
                            filePath:savePath,
                            fileExtension: '.jpg',
                            thumbImage:img
                        });
                    }


                }).catch(err => {
                    console.log('download err', err);
                });

            }
        }
    }



    initNavigator(){
        if(Platform.OS === 'ios') {
            UserInfoStore.getMobileLoginInfo().then(
                v => {
                    if(v && v.open) {
                        this.props.navigator.setButtons({
                            rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
                        });
                    } else {
                        this.props.navigator.setButtons({
                            rightButtons: [{icon: require('../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
                        });
                    }
                }, e => {
                    this.props.navigator.setButtons({
                        rightButtons: [{icon: require('../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
                    });
                }
            );
        } else {
            // Android一直打开微信登录
            this.props.navigator.setButtons({
                rightButtons: [{icon: require('../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
            });
        }

    }
    render(){

        return (
            <Swiper
                loop = {false}
                index = {this.props.index}
                style={styles.wrapper}
                dotColor = 'gray'
                activeDotColor = 'white'
                onIndexChanged = {(index)=>{this.index = index}}

            >
                {
                    this.props.imageArr.map((item,index)=>{
                        let width =SCREEN_WIDTH;
                        let height = width * 0.6;
                        if(item.rotate / 90 %2 == 1){
                            //90 270
                            height = SCREEN_WIDTH
                            width = height*0.6

                        }
                        let rotate = item.rotate+'deg'
                        return(
                            <View key = {index} style={styles.slide}>
                                <ImageLoad
                                    style={{width:width,height:height,transform:[{rotate:rotate}]}}
                                    resizeMode="contain"
                                    loadingStyle={{size: 'large', color: 'black'}}
                                    source={{uri:item.receiptPath}}
                                />
                            </View>
                        )
                    })
                }

            </Swiper>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },

    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})