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
    Image,
    PixelRatio
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
            if (this.props.leftItem === undefined)return
            return this.props.leftItem();
        }

    }

    // 中间
    renderTitleItem() {
        if(this.props.isSecondLevel){

            return (
                <Text style={{fontSize:setSpText(18),color:'white'}}>{this.props.title}</Text>
            )
        }else{
            if (this.props.titleItem === undefined)return;
            return this.props.titleItem();
        }
    }


    // 右边
    renderRightItem() {
        if(this.props.isSecondLevel) {
            if(this.props.isDemo == 1){
                return(
                    <View style={{width:width/5,height:44,}}/>
                )
            }else{

                return(
                    <TouchableWithoutFeedback onPress={()=>this.props.shareToWeXin && this.props.shareToWeXin()}>
                        <View style={{width:64,height:44, alignItems:'center',flexDirection:'row-reverse'}}>
                            <Image style={{marginRight:10}} source={require('../../img/share.png')} />
                        </View>
                    </TouchableWithoutFeedback>
                )
            }


        }else{
            if (this.props.rightItem === undefined) return;
            return this.props.rightItem();
        }

    }

    render() {

        return (
            <View style={styles.container}>
                {/* 左边 */}
                <View  >
                    {this.renderLeftItem()}
                </View>
                {/* 中间 */}
                <View >
                    {this.renderTitleItem()}
                </View>
                {/* 右边 */}
                <View  >
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
    viewtabstyle:{
        width:width/5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    }
});
