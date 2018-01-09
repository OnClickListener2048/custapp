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
            <Text numberOfLines={2} style = {[styles.leftTextStyle,this.props.leftTextStyle]}>{this.props.leftText}</Text>
        </View>)




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
                    {!this.props.closeRightIcon&&//控制右侧图标显示、隐藏
                    <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
                    }
                    <Text style = {[styles.rightTextStyle,this.props.rightTextStyle,{marginRight:10}]}>{this.props.rightText}</Text>
                    {this.props.rightView}
                </View>
            );
        }else if(this.props.isRightBtnClick){
            //不可以点击
            return(
                <View style = {styles.rightViewStyle}>
                    <TouchableOpacity style = {[styles.rightImgStyle,{width:36,height:36}]} onPress = {() => {this.props.rightBtnOnPress()}}>
                        <Image resizeMode = "contain" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
                    </TouchableOpacity>
                    <Text style = {[styles.rightTextStyle,this.props.rightTextStyle]}>{this.props.rightText}</Text>
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
        height:51/375.0*SCREEN_WIDTH,
        // height:51,

        // 下边框
        // borderBottomColor:'#e8e8e8',
        // borderBottomWidth:0.5,
        paddingLeft:2,
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
