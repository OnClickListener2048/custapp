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
                    <View style={{width:64,height:44, justifyContent:'center',paddingLeft:14}}>
                        <Image style={{marginLeft:10}} source={require('../../img/arrow_left_white.png')} />
                    </View>
                </TouchableWithoutFeedback>

            )
        }else{
            if (this.props.leftItem === undefined){
                return(
                    <View style={{width:64,height:44, justifyContent:'center',paddingLeft:14}}/>
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
                    <View style={{width:64,height:44,justifyContent:'center',alignItems:'center',paddingRight:14}} >
                        <Text style={{fontSize:18,color:'white'}}>{this.props.year}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }else{
            if (this.props.rightItem === undefined){
                return(
                    <TouchableWithoutFeedback onPress={()=>{this._showDataPicker()}}>
                        <View style={{width:64,height:44,justifyContent:'center',alignItems:'center',paddingRight:20}} >
                            <Text style={{fontSize:18,color:'white'}}>{this.props.year}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
            return this.props.rightItem();
        }

    }
    _showDataPicker =() =>{
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

                if(data[0] == this.year){
                    this.props.callback && this.props.callback(data[0],this.month)

                }else{
                    this.props.callback && this.props.callback(data[0],'12')

                }
            },
        });
        Picker.show();
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
