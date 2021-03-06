/**
 * Created by zhuangzihao on 2017/12/19.
 */
import React from 'react';
import {Platform, View, Text,Image,TouchableOpacity,
    NativeModules,TextInput,Dimensions,StyleSheet} from 'react-native';
import {deviceHeight,deviceWidth} from "../../util/ScreenUtil";
const contentwidth = deviceWidth*0.7
import Alert from "react-native-alert";
import px2dp from '../../util';
import BComponent from '../../base/BComponent'
const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width


// 升级弹窗
export default class AccreditInputBox extends BComponent {

    constructor(props) {
        super(props);
        this.state={
                phoneNum:'',//增加授权的手机号
        }
        this.updateMobile = this.updateMobile.bind(this);


    }

    updateMobile(phoneNum) {
        phoneNum = phoneNum.replace(/[^\d]/g, '');// 过滤非数字输入
        let mobileValid = phoneNum.length > 0 && (phoneNum.match(/^([0-9]{11})?$/)) !== null;
        let mobileNotEmpty = phoneNum.length > 0;
        this.setState({phoneNum});
    }

    render() {
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <View style={{borderRadius: 8,justifyContent:'center',alignItems:'center',backgroundColor:'#F2F2F2',width:304.7}}>
                    <Text style={{fontSize:17,color:'#333333',marginTop:28}}>
                        {'添加您要授权看账的手机号码'}
                    </Text>
                    <View style={styles.textInputContainer}>
                        <TextInput underlineColorAndroid='transparent' maxLength={11}
                               keyboardType='numeric' value={this.state.phoneNum}
                               placeholderTextColor='#BABABA'
                               style={styles.textInput} placeholder='' returnKeyType='next'
                               onChangeText={
                                   (phoneNum) => {
                                       this.updateMobile(phoneNum);
                                   }
                               }/>
                    </View>
                    <View style={{backgroundColor:'#D4D4D4',height:0.5,width:304.7,marginLeft:6,marginRight:6}}/>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={()=>{this._cancle()}}>
                        <View style={{width:151.35,height:45,borderBottomLeftRadius: 8,
                            backgroundColor:'#F2F2F2',justifyContent:'center',
                            alignItems:'center'}}>
                            <Text style={{color:'#999999',fontSize:19}}>取消</Text>

                        </View>
                    </TouchableOpacity>
                        <View style={{backgroundColor:'#D4D4D4',height:45,width:0.5}}/>
                        <TouchableOpacity onPress={()=>{this._addPhone()}}>
                        <View style={{width:151.35,height:45,backgroundColor:'#F2F2F2'
                            ,justifyContent:'center',borderBottomRightRadius: 8,
                        alignItems:'center'}}>
                            <Text style={{color:'#333333',fontSize:19}}>{'添加'}</Text>

                        </View>
                    </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }

    //添加
    _addPhone(){
        let callback = this.props.callback;
        if(callback) {
            callback(this.state.phoneNum);
        }
        this.props.navigator.dismissLightBox()

    }

    //取消
    _cancle(){

        this.props.navigator.dismissLightBox()

    }
}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        width: deviceW-120,
        marginLeft: px2dp(0),
        padding: 0,
        fontSize: px2dp(32),
        color: '#6a6a6a',
        paddingLeft: 5,
    },
    textInputContainer:{
        justifyContent:'center',
        alignItems:'center',
        height: 40,
        width: 240,
        marginTop:18,
        marginBottom:23,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'center',
        borderColor:'#D4D4D4',
        borderWidth:1,
    }
})