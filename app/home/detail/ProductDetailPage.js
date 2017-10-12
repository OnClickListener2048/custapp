/**
 * Created by zhuangzihao on 2017/9/11.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    WebView,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,

    Linking,
    StyleSheet,
    TextInput
} from 'react-native';
import WebTab from './WebVIew'
import BComponent from '../../base';
const window = Dimensions.get('window');
import Modal from 'react-native-modalbox';
const dismissKeyboard = require('dismissKeyboard');     // 获取键盘回收方法

export const SCREEN_HEIGHT = window.height;
export const SCREEN_WIDTH = window.width;
export default class ProductDetailPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal:false,
        };
    }
    static defaultProps = {
        item:{}
    };

    callPhone(){
        Linking.openURL('tel:13522807924')
    }
    onlineMessage(){
    //在线留言
        this.refs.modal3.open()
    }

    submitMessage(){

    }

    // #E13238
    render(){
        return(

            <View style={{flex:1}}>
                <Image style={{width:DeviceInfo.width,height:DeviceInfo.width*0.4}} source={{uri:this.props.item.img}}/>
                <WebTab url={this.props.item.desc_url}/>
                <View style={styles.tabViewContainer}>
                    <TouchableOpacity
                        style={styles.btnTouchContainer}
                        onPress={() => {
                            this.callPhone()
                        }}>
                    <View style={[styles.btnContainer,{backgroundColor:'#E13238'}]}>
                    <Text style={styles.textContainer}>{'免费咨询'}</Text>
                    </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnTouchContainer}
                        onPress={() => {
                                          this.onlineMessage()
                                      }}>
                    <View  style={[styles.btnContainer,{backgroundColor:'#E19F0E'}]}>
                        <Text style={styles.textContainer}>{'在线留言'}</Text>
                    </View>
                    </TouchableOpacity>
                </View>

                <Modal
                    style={ {height: 479, width: SCREEN_WIDTH - 56, backgroundColor:'#f9f9f9',justifyContent: 'center', alignItems: 'center', marginTop: 0}}
                    position={"center"} ref={"modal3"}>

                    <View  style={[{height: 479 - 20, width: SCREEN_WIDTH - 76, backgroundColor:'#ffffff',flexDirection: 'column',alignItems:'center'}]}>
                        <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 30}]} placeholder='服务区域'/>
                        <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]} placeholder='您的称呼'/>
                        <TextInput underlineColorAndroid='transparent' placeholderTextColor={'#666666'} style={[styles.textInputStyle,{marginTop: 10}]} placeholder='联系电话'/>
                        <TextInput underlineColorAndroid='transparent' multiline={true} placeholderTextColor={'#D9D8D8'} style={[styles.textInputStyle,{marginTop: 10,height:180}]} placeholder='请在此输入留言内容,我们会尽快与您联系。'/>
                        <TouchableOpacity
                            style={styles.submitBtnTouchContainer}
                            onPress={() => {
                                this.submitMessage()
                            }}>
                            <View  style={[styles.btnContainer,{backgroundColor:'#FF9F0E',borderRadius:8}]}>
                                <Text style={styles.textContainer}>{'我要咨询'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>

        )
    }
}


const styles = StyleSheet.create({


    tabViewContainer: {
        height: 50,
        width: SCREEN_WIDTH,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        flexDirection: 'row',
    },

    btnTouchContainer: {
        flexDirection: 'row',
        height:50,
        width:(SCREEN_WIDTH - 4)/2
    },

    btnContainer: {
        flexDirection: 'row',
        justifyContent:'center',
        flex:1,
        alignItems:'center'
    },
    textContainer: {
        fontSize:16,
        textAlign:'center',
        color:'#ffffff'
    },
    textInputStyle:{
        borderRadius:8,
        borderColor:'#CBCBCB',
        borderWidth:1,
        width:SCREEN_WIDTH - 76 - 40,
        height:40,
        color:'#666666',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize:16
    },
    submitBtnTouchContainer: {
        flexDirection: 'row',
        height:40,
        width:208,
        marginTop:24,
        borderRadius:8
    },
});