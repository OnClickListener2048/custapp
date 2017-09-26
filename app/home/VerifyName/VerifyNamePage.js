/**
 * Created by jiaxueting on 2017/9/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import BComponent from '../../base';
import TextInputView from "./view/TextInputView";
import SubmitButton from "../../view/SubmitButton";

const deviceWidth = Dimensions.get('window').width;
const deviceHight = Dimensions.get('window').height;
export default class HomePage extends BComponent {
    constructor(props) {
        super(props);

        this.state = {
            companyNameNotEmpty: false,
            phoneNumNotEmpty: false,
            MessageNameNotEmpty: false,
        }
        this._doVerfiyResult = this._doVerfiyResult.bind(this);

    }

    //输入框子组件
    renderInput(textType,textName,textContent){
        return(
            <TextInputView
                ref={textType}
                textName={textName}
                content={textContent}
                textEditable={true}/>
        )

    }

    _doVerfiyResult(){

    }

    render(){
        return(
            <ScrollView style={{flex:1,backgroundColor:'#FFFFFF',
                flexDirection: 'column'}}>
                <View style={{width:DeviceInfo.width}}>
                    <Image source={require('../../img/name_bg.png')} style={{width:deviceWidth,justifyContent:'center',
                        alignItems:'center',marginTop:DeviceInfo.OS==='ios'?20:0}}>
                        <Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>公司名称查询</Text>
                        <Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>提升工商注册通过率</Text>
                    </Image>
                </View>
                {this.renderInput('companyName','请输入要注册的公司名称','')}
                {this.renderInput('phoneNum','请输入手机号','')}
                {this.renderInput('MessageName','请输入联系人姓名','')}
                <SubmitButton onPress={this._doVerfiyResult} isEnabled={(this.state.companyNameNotEmpty && this.state.phoneNumNotEmpty && this.state.MessageNameNotEmpty)}
                              text="立即免费核名"
                />
            </ScrollView>
        )
    }
}