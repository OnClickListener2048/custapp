/**
 * Created by zhuangzihao on 2017/12/19.
 */
import React from 'react';
import {Platform, View, Text,Image,TouchableOpacity,
    NativeModules,TextInput,Dimensions,StyleSheet} from 'react-native';
import {deviceHeight,deviceWidth} from "../../util/ScreenUtil";
const contentwidth = deviceWidth*0.7
import Toast from 'react-native-root-toast';
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
            companyId:'',//公司ID
        }
        this.updateMobile = this.updateMobile.bind(this);


    }
    static defaultProps = {
        companyId:'',//公司ID

    };

    updateMobile(phoneNum) {
        phoneNum = phoneNum.replace(/[^\d]/g, '');// 过滤非数字输入
        let mobileValid = phoneNum.length > 0 && (phoneNum.match(/^([0-9]{11})?$/)) !== null;
        let mobileNotEmpty = phoneNum.length > 0;
        this.setState({phoneNum});
    }

    render() {
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <View style={{borderRadius: 8,justifyContent:'center',alignItems:'center',backgroundColor:'#F2F2F2',width:284.7}}>
                    <Text style={{fontSize:16,color:'#333333',marginTop:28}}>
                        {'添加您要授权看账的手机号码'}
                    </Text>
                    <View style={styles.textInputContainer}>
                        <TextInput underlineColorAndroid='transparent' maxLength={11}
                               keyboardType='numeric' value={this.state.phoneNum}
                               placeholderTextColor='#BABABA'
                               style={styles.textInput} placeholder='手机号码' returnKeyType='next'
                               onChangeText={
                                   (phoneNum) => {
                                       this.updateMobile(phoneNum);
                                   }
                               }/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={()=>{this._cancle()}}>
                        <View style={{width:141.35,height:45,borderTopWidth:1,borderRightWidth:1,borderBottomLeftRadius: 8,
                            borderLeftWidth:0,borderBottomWidth:0,borderColor:'#D4D4D4',backgroundColor:'#F2F2F2',justifyContent:'center',
                            alignItems:
                                'center'}}>
                            <Text style={{color:'#999999',fontSize:18}}>取消</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this._addPhone()}}>
                        <View style={{width:141.35,height:45,backgroundColor:'#F2F2F2'
                            ,justifyContent:'center',borderBottomRightRadius: 8,
                        alignItems:'center',borderTopWidth:1,borderRightWidth:0,borderLeftWidth:0,borderBottomWidth:0,borderColor:'#D4D4D4'}}>
                            <Text style={{color:'#333333',fontSize:18}}>{'添加'}</Text>

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
        fontSize: px2dp(28),
        color: '#6a6a6a',
    },
    textInputContainer:{
        justifyContent:'center',
        alignItems:'center',
        height: 35,
        width: 240,
        marginTop:13,
        marginBottom:18,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'center',
        borderColor:'#D4D4D4',
        borderWidth:1,
    }
})