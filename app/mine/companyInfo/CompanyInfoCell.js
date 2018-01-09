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

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class CompanyInfoCell extends Component {
    static defaultProps = {
        isClick:true,//是否可以点击，  true自带右侧箭头
        onPress:function() {//点击事件

        },
        isRightBtnClick:true,//是否可以点击，  true自带右侧箭头
        rightBtnOnPress:function() {//右边按钮点击事件

        },

        leftSelectBtnOnPress:function() {//按钮点击事件

        },


        leftTextNumLine : 0, //左侧文本行数
        leftText:'',//左侧文字内容
        leftTextStyle:{},//左侧文字样式
        leftImgStyle:{},//左侧图片样式
        leftIcon:null,//左侧图片  本地图片传require（），网络图片传字符串
        leftIconTouch:false,//左边图标是否可点击，默认不可点
        leftTextIcon:null,//左侧图片(靠文字右侧图片)  本地图片传require（），网络图片传字符串

        centerTextStyle:{}, //中间文字样式
        centerText:'',//中间文字内容
        rightText:'',//右侧副标题内容
        closeRightIcon:false,//默认不关闭右侧图标
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



        return (<View style = {styles.leftViewStyle}>
            <TouchableOpacity style={[styles.leftImgStyle, this.props.leftImgStyle,{width : 36 ,height:36,alignItems:'center',justifyContent:'center' }]} onPress = {() => {this.props.leftSelectBtnOnPress()}}>
                <Image resizeMode="contain" style={[styles.leftImgStyle, this.props.leftImgStyle]}
                       source={this.props.leftIcon}/>
            </TouchableOpacity>
        </View>)




    }

    _renderCenterView(){

        return(
            <TouchableOpacity style={[styles.centerViewStyle]} onPress = {() => {this.props.rightBtnOnPress()}}>

            <View style = {[styles.centerViewStyle]}>
                <Text numberOfLines={2} style = {[styles.leftTextStyle,this.props.leftTextStyle]}>{this.props.leftText}</Text>
            </View>
            </TouchableOpacity>

        );


    }

    _renderRightView(){

            //不可以点击
            return(
                <TouchableOpacity style={[styles.rightViewStyle]} onPress = {() => {this.props.rightBtnOnPress()}}>

                <View style = {styles.rightViewStyle}>

                        <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
                    {this.props.rightView}
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
        alignItems:'center',
        // 高度
        height:51/375.0*SCREEN_WIDTH,
        // height:51,

        // 下边框
        // borderBottomColor:'#e8e8e8',
        // borderBottomWidth:0.5,

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
        height:51/375.0*SCREEN_WIDTH,

    },

    rightViewStyle:{
        marginRight:4,

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
        marginLeft:10,

        // 圆角
    },

    rightTextStyle:{
        fontSize:14,
        color:'#999999'
    }

});
