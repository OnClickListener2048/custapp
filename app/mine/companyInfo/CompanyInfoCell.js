/**
 * Created by jinglan on 2018/1/9.
 */
import React, { Component } from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import SubmitButton from "../../view/SubmitButton";
import px2dp from '../../util/index';
export default class CompanyInfoCell extends Component {
    static defaultProps = {
        isClick:true,//是否可以点击，  true自带右侧箭头
        isRightBtnClick:true,//是否可以点击，  true自带右侧箭头

        onPress:function() {},//点击事件
        rightBtnOnPress:function() {},//右边按钮点击事件
        authorizeButton:function() {},//点击授权按钮
        leftSelectBtnOnPress:function() {}, //按钮点击事件

        leftText:'',//左侧文字内容
        leftIcon:null,//左侧图片  本地图片传require（），网络图片传字符串
        underLine:true,//是否有分割线
        surviveText:'',
        ownerText:'',
        underLineStyle:{}//分割线样式自定义
    };

    render() {
        let underlineStyle = {};
        if(this.props.underLine){
            underlineStyle = {
                borderBottomColor:'#ececec',
                borderBottomWidth:DeviceInfo.onePR,
            }
        }

        return(
            <View
                accessibilityLabel="company_cell" testID="company_cell"
                style = {[styles.container,{height:(this.props.ownerText.length > 0 &&this.props.ownerText=='拥有者')?80:65},underlineStyle,this.props.underLineStyle,this.props.style]}>
                {this._renderLeftView()}
                {this._renderRightView()}
            </View>
        );
    }

    _renderLeftView(){
        return (<View style = {styles.leftViewStyle}>
            <TouchableOpacity style={[styles.leftImgStyle, this.props.leftImgStyle,{width : 36 ,height:36,alignItems:'center',justifyContent:'center' }]} onPress = {() => {this.props.leftSelectBtnOnPress()}}>
                <Image
                    accessibilityLabel="company_check_img" testID="company_check_img"
                    resizeMode="center" style={[styles.leftImgStyle, this.props.leftImgStyle]}
                       source={this.props.leftIcon}/>
            </TouchableOpacity>
        </View>)
    }

    _renderRightView(){
        return(
            <TouchableOpacity style={[styles.rightViewStyle]} onPress = {() => {this.props.rightBtnOnPress()}}>
                <View style = {styles.wrap1}>
                    <Text accessibilityLabel="company_left" testID="company_left"
                          numberOfLines={2} style = {[styles.leftTextStyle]}>{this.props.leftText}</Text>
                </View>
                <View style = {styles.wrap2}>
                    <View style={styles.heng}>
                        {this.props.ownerText.length > 0 &&
                        <Text accessibilityLabel="company_state2" testID="company_state2"
                              style = {[styles.ownerText]}>{this.props.ownerText}</Text>}
                        {this.props.surviveText.length > 0 &&
                        <Text accessibilityLabel="company_state1" testID="company_state1"
                              style = {[styles.surviveText]}>{this.props.surviveText}</Text>}
                    </View>
                    {this.props.ownerText.length > 0 &&this.props.ownerText=='拥有者'&&
                    <TouchableOpacity onPress={()=>{this.props.authorizeButton()}}>
                        <View style={styles.buttonViewDisabled}>
                            <Text style={styles.shouquanText}>点击授权</Text>
                        </View>
                    </TouchableOpacity>
                    }
                </View>
            </TouchableOpacity>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        // 主轴的方向
        flexDirection:'row',
        // 主轴的对齐方式
        // justifyContent:'space-between',
        // 背景颜色
        backgroundColor:'white',
        // 垂直居中
        // alignItems:'center',
        // 高度
        // height:60/375.0*SCREEN_WIDTH,

    },

    leftViewStyle:{
        // 主轴的方向
        flexDirection:'row',
        // 侧轴居中
        // alignItems:'center',
        marginTop:5
    },

    centerViewStyle:{
        // 主轴的方向
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
        height:51/375.0*SCREEN_WIDTH,

    },

    rightViewStyle:{
        flex:1,
        // 侧轴居中
        marginTop:10,
        justifyContent:'space-between',
        flexDirection:'row'
        // alignItems:'center',
    },
    wrap1:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginRight:15,
    },
    wrap2:{
    },

    leftImgStyle:{ // 左边的图片
        marginTop:2,
    },

    leftTextStyle:{
        marginLeft:2,
        marginRight:1,
        width:200,
        lineHeight:25,
        fontSize:16,
        color:'#333333',
    },

    rightImgStyle:{ // 左边的图片
        width:26,
        height:26
    },

    rightTextStyle:{
        fontSize:14,
        color:'#999999'
    },
    surviveText:{
        fontSize:14,
        color:'#70CBC5',
        marginLeft:5,
        marginRight:10,
        marginTop:Platform.OS==='ios'?4:4
    },
    ownerText:{
        fontSize:14,
        color:'#999999',
        marginLeft:2,
        marginTop:Platform.OS==='ios'?4:4
    },
    buttonViewDisabled: {
        backgroundColor: 'transparent',
        margin: 0,
        borderRadius: 2,
        borderColor: '#CEAF72',
        borderWidth: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        height: 26,
        width: 80,
        marginTop:10,
        marginRight:11
    },
    shouquanText:{
        color:'#CEAF72',
        fontSize:14,
    },
    heng:{
        flexDirection:'row',
        marginRight:5,
    }
});
