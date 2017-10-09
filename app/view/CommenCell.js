/**
 * Created by zhuangzihao on 2017/9/18.
 */
import React, { Component } from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,

} from 'react-native';
export default class CommenCell extends Component {
    static defaultProps = {
        isClick:true,//是否可以点击，  true自带右侧箭头
        onPress:function() {//点击事件

        },
        leftText:'',//左侧文字内容
        leftTextStyle:{},//左侧文字样式
        leftImgStyle:{},//左侧图片样式
        leftIcon:null,//左侧图片  本地图片传require（），网络图片传字符串

        centerTextStyle:{}, //中间文字样式
        centerText:'',//中间文字内容
        rightText:'',//右侧副标题内容
        rightTextStyle:{},//右侧副标题样式
        underLine:true,//是否有分割线
        underLineStyle:{},//分割线样式自定义
        style:{},//最外层盒子样式自定义 设置高 背景类似属性
        rightView:null
    };

    render() {

        let underlineStyle = {}
        if(this.props.underLine){
            underlineStyle = {
                borderBottomColor:'#ececec',
                borderBottomWidth:DeviceInfo.onePR,
            }
        }

        if(this.props.isClick){
            //可以点击
            return(
                <TouchableOpacity onPress = {() => {this.props.onPress()}} >
                    <View style = {[styles.container,underlineStyle,this.props.underLineStyle,this.props.style]}>
                        {this._renderLeftView()}
                        {this._renderCenterView()}
                        {this._renderRightView()}
                    </View>
                </TouchableOpacity>
            );
        }else{
            //不可以点击
            return(
                <View style = {[styles.container,underlineStyle,this.props.underLineStyle,this.props.style]}>
                    {this._renderLeftView()}
                    {this._renderCenterView()}
                    {this._renderRightView()}
                </View>
            );
        }
    }

    _renderLeftView(){

        if(this.props.leftIcon == null){
            //左边没图片
            return(
                <View style = {styles.leftViewStyle}>
                    <Text style = {[styles.leftTextStyle,this.props.leftTextStyle]}>{this.props.leftText}</Text>
                </View>
            );
        }else{
            //左边有图片
            if(typeof (this.props.leftIcon) == 'string'){
                return(
                    <View style = {styles.leftViewStyle}>
                        <Image resizeMode = "contain" style = {[styles.leftImgStyle,this.props.leftImgStyle]} source={{uri:this.props.leftIcon}} />
                        <Text style = {[styles.leftTextStyle,this.props.leftTextStyle,{marginLeft:10}]}>{this.props.leftText}</Text>
                    </View>
                );
            }else {
                return(
                    <View style = {styles.leftViewStyle}>
                        <Image resizeMode = "contain" style = {[styles.leftImgStyle,this.props.leftImgStyle]} source={this.props.leftIcon} />
                        <Text style = {[styles.leftTextStyle,this.props.leftTextStyle,{marginLeft:10}]}>{this.props.leftText}</Text>
                    </View>
                )
            }


        }


    }

    _renderCenterView(){

            return(
                <View style = {styles.centerViewStyle}>
                    <Text style = {[styles.centerTextStyle,this.props.centerTextStyle]}>{this.props.centerText}</Text>
                </View>
            );


    }

    _renderRightView(){

        if(this.props.isClick){

            //可以点击
            return(
                <View style = {styles.rightViewStyle}>
                    <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../img/left_button.png')} />
                    <Text style = {[styles.rightTextStyle,this.props.rightTextStyle,{marginRight:10}]}>{this.props.rightText}</Text>
                    {this.props.rightView}
                </View>
            );
        }else{
            //不可以点击
            return(
                <View style = {styles.rightViewStyle}>
                    <Text style = {[styles.rightTextStyle,this.props.rightTextStyle]}>{this.props.rightText}</Text>
                    {this.props.rightView}
                </View>
            );
        }
    }

}
const styles = StyleSheet.create({
    container: {
        // 主轴的方向
        flexDirection:'row',
        // 主轴的对齐方式
        justifyContent:'space-between',
        // 背景颜色
        backgroundColor:'white',
        // 垂直居中
        alignItems:'center',
        // 高度
        height:51,

        // 下边框
        // borderBottomColor:'#e8e8e8',
        // borderBottomWidth:0.5,
        paddingLeft:14,
        paddingRight:14
    },
    leftViewStyle:{
        // 主轴的方向
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
    },

    centerViewStyle:{
        // 主轴的方向
        flexDirection:'row',
        // 侧轴居中
        alignItems:'center',
    },

    rightViewStyle:{
        flexDirection:'row-reverse',
        // 侧轴居中
        alignItems:'center',

    },
    leftImgStyle:{ // 左边的图片

    },

    leftTextStyle:{
        fontSize:16,
        color:'#333333'
    },
    centerTextStyle:{
        fontSize:16,
        color:'#333333'
    },

    rightImgStyle:{ // 左边的图片

        // 圆角
    },

    rightTextStyle:{
        fontSize:14,
        color:'#999999'
    }

});
