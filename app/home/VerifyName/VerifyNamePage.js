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
export default class HomePage extends BComponent {
    constructor(props) {
        super(props);

        this.state = {
            companyNameNotEmpty: false,
            phoneNumNotEmpty: false,
            MessageNameNotEmpty: false,
        }
        this._doVerfiyResult = this._doVerfiyResult.bind(this);
        this._isNotEmpty = this._isNotEmpty.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
    }

    _isNotEmpty(contentType,content){
        if(contentType==='companyName'){
            if(content.length===0){
                this.setState({companyNameNotEmpty:false});
            }else{
                this.setState({companyNameNotEmpty:true});
            }
        }else if(contentType==='phoneNum'){
            if(content.length===0){
                this.setState({phoneNumNotEmpty:false});
            }else{
                this.setState({phoneNumNotEmpty:true});
            }
        }else if(contentType==='MessageName'){
            if(content.length===0){
                this.setState({MessageNameNotEmpty:false});
            }else{
                this.setState({MessageNameNotEmpty:true});
            }
        }
    }

    //输入框子组件
    renderInput(textType,textName,textContent){
        return(
            <TextInputView
                callback={this._isNotEmpty}
                contentType={textType}
                textName={textName}
                content={textContent}
                textEditable={true}/>
        )

    }

    _doVerfiyResult(){
        this.props.navigator.push({
            screen: 'VerifyResultPage',
            title:'免费核名',
        });
    }

    render(){
        return(
            <ScrollView style={{flex:1,backgroundColor:'#FFFFFF',
                flexDirection: 'column'}}>
                <View style={{width:DeviceInfo.width}}>
                    <Image source={require('../../img/verify_name.png')} style={{width:deviceWidth,justifyContent:'center',
                        alignItems:'center',marginTop:DeviceInfo.OS==='ios'?20:0}}>
                        {/*<Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>公司名称查询</Text>*/}
                        {/*<Text style={{backgroundColor:'transparent',fontSize:24,color:'white',fontWeight:'bold'}}>提升工商注册通过率</Text>*/}
                    </Image>
                </View>
                {this.renderInput('companyName','请输入要注册的公司名称','')}
                {this.renderInput('phoneNum','请输入手机号','')}
                {this.renderInput('MessageName','请输入联系人姓名','')}
                <SubmitButton onPress={this._doVerfiyResult} isEnabled={(this.state.companyNameNotEmpty&&this.state.phoneNumNotEmpty&&
                    this.state.MessageNameNotEmpty)}
                              text="立即免费核名"
                />
            </ScrollView>
        )
    }
}