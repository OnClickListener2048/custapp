/**
 * Created by zhuangzihao on 2017/11/24.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import {isIphoneX} from '../../util/iphoneX-helper'
import Picker from 'react-native-picker';
const {width, height} = Dimensions.get('window');
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast'

/**
 * 顶部导航栏, 带左右按钮和中间定制.
 */
export default class ServiceNavigatorBar extends Component {
    constructor(props) {
        super(props);
        let today = new Date();//获得当前日期
        this.yearArr=[]
        for (let i = 2010;i<=today.getFullYear();i++){
            this.yearArr.push(i.toString())
        }
        this.year=today.getFullYear().toString()
        this.month = today.getMonth() + 1
    }
    static propTypes = {
        leftItem:PropTypes.func,
        titleItem:PropTypes.func,
        rightItem:PropTypes.func,
    };

    // 左边
    renderLeftItem() {
        if(this.props.isSecondLevel){
            return (
                <TouchableWithoutFeedback onPress={()=>this.props.navigator.pop()}>
                    <View style={{width:64,height:44, justifyContent:'center'}}>
                        <Image style={{marginLeft:10}} source={require('../../img/arrow_left_white.png')} />
                    </View>
                </TouchableWithoutFeedback>

            )
        }else{
            if (this.props.leftItem === undefined){
                return(
                    <View style={{width:64,height:44, justifyContent:'center'}}/>
                )
            }
            return this.props.leftItem();
        }

    }

    // 中间
    renderTitleItem() {
        if(this.props.isSecondLevel){
            return (
                <Text style={{fontSize:setSpText(18),fontWeight:'bold',color:'white'}}>{this.props.title}</Text>
            )
        }else{
            if (this.props.titleItem === undefined)return;
            return this.props.titleItem();
        }
    }

    // 右边
    renderRightItem() {
        if(this.props.isSecondLevel){
            return (
                <TouchableWithoutFeedback onPress={()=>{this._showDataPicker()}}>
                    <View style={{width:64,height:44,justifyContent:'center',alignItems:'center'}} >
                        <Text style={{ width:54,height:18,lineHeight:18,fontSize:12,color:'white',borderWidth:1,borderColor:'white',textAlign:'center'}}>{this.props.year}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }else{
            if (this.props.rightItem === undefined){
                return(
                    <TouchableWithoutFeedback onPress={()=>{this._showDataPicker()}}>
                        <View style={{width:64,height:44,justifyContent:'center',alignItems:'center'}} >
                            <Text style={{width:54,height:18,lineHeight:18,fontSize:12,color:'white',borderWidth:1,borderColor:'white',textAlign:'center'}}>{this.props.year}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
            return this.props.rightItem();
        }

    }
    _showDataPicker =() =>{

        if(this.props.isSecondLevel){
            //二级页面
            if(this.props.isDemo == 1){
                //演示数据
                Toast.show('当前为演示数据！')

            }else{
                //真实数据
                Picker.init({
                    pickerData: this.yearArr,
                    selectedValue: [this.props.year],
                    pickerConfirmBtnText:'确定',
                    pickerCancelBtnText:'取消',
                    pickerTitleText:'请选择年份',
                    pickerTitleColor:[255,255,255,1],
                    pickerConfirmBtnColor:[102,75,20,1],
                    pickerCancelBtnColor:[102,75,20,1],
                    pickerToolBarBg:[206,175,114,1],
                    pickerBg:[255,255,255,1],
                    onPickerConfirm: data => {
                        if(this.props.year == data[0])return

                        if(data[0] == this.year){
                            this.props.callback && this.props.callback(data[0],this.month)

                        }else{
                            this.props.callback && this.props.callback(data[0],'12')

                        }
                    },
                });
                Picker.show();
            }
        }else{
            //一级页面
            if(this.props.isLogin){
                //登录
                if(this.props.isDemo == 1){
                    //演示数据
                    Toast.show('当前为演示数据！')

                }else{
                    //真实数据
                    Picker.init({
                        pickerData: this.yearArr,
                        selectedValue: [this.props.year],
                        pickerConfirmBtnText:'确定',
                        pickerCancelBtnText:'取消',
                        pickerTitleText:'请选择年份',
                        pickerTitleColor:[255,255,255,1],
                        pickerConfirmBtnColor:[102,75,20,1],
                        pickerCancelBtnColor:[102,75,20,1],
                        pickerToolBarBg:[206,175,114,1],
                        pickerBg:[255,255,255,1],
                        onPickerConfirm: data => {
                            if(this.props.year == data[0])return

                            if(data[0] == this.year){
                                this.props.callback && this.props.callback(data[0],this.month)

                            }else{
                                this.props.callback && this.props.callback(data[0],'12')

                            }
                        },
                    });
                    Picker.show();
                }
            }else{
                //未登录
                Alert.alert('提示', '立即登录查看您公司的财务数据', [{
                    text: "再看看",
                    onPress: ()=>{
                        console.log('you clicked cancel');
                    },
                    color:'#999999'
                },
                    {
                        text: "登录",
                        onPress: ()=>{
                            loginJumpSingleton.goToLogin(this.props.navigator);
                        },
                    }]);
            }

        }
    }
    render() {
        return (
            <View style={styles.container}>
                {/* 左边 */}
                <View>
                    {this.renderLeftItem()}
                </View>
                {/* 中间 */}
                <View>
                    {this.renderTitleItem()}
                </View>
                {/* 右边 */}
                <View>
                    {this.renderRightItem()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width:width,
        height:Platform.OS === 'ios' ? isIphoneX()?90:64 : 44,
        backgroundColor:'#D9C298',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:Platform.OS === 'ios' ?isIphoneX()?35: 20 : 0,
        zIndex:9999,
    },
});
