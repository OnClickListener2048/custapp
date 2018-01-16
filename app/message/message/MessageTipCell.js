
import React, { Component,PropTypes } from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class MessageTipCell extends Component {
    static defaultProps = {
        isClick:true,//是否可以点击，  true自带右侧箭头
        isRightBtnClick:true,//是否可以点击，  true自带右侧箭头
        messageNum:0,

        onPress:function() {},//点击事件
        rightBtnOnPress:function() {},//右边按钮点击事件
        leftSelectBtnOnPress:function() {}, //按钮点击事件

        leftText:'',//左侧文字内容
        leftIcon:null,//左侧图片  本地图片传require（），网络图片传字符串
        underLine:true,//是否有分割线
        surviveText:'',
        ownerText:'',
        underLineStyle:{},//分割线样式自定义

    };




    setNewNum(messageNum) {
        console.log("到这里呢777",messageNum);

        this.props.messageNum = messageNum;

        console.log("到这里呢666");

    }

    render() {

        let underlineStyle = {};
        if(this.props.underLine){
            underlineStyle = {
                borderBottomColor:'#ececec',
                borderBottomWidth:DeviceInfo.onePR,
            }
        }

        return(
            <TouchableOpacity  onPress = {() => {this.props.onPress()}}>

            <View style = {[styles.container,underlineStyle,this.props.underLineStyle]}>
                {this._renderLeftView()}
                {this._renderRightView()}
            </View>
            </TouchableOpacity>

        );
    }

    _renderLeftView(){

        return (<View style = {styles.leftViewStyle}>
                <Image resizeMode="center" style={[styles.leftImgStyle, this.props.leftImgStyle]}
                       source={this.props.leftIcon}/>

            {this.props.messageNum > 0 && <View  style={{backgroundColor:'red',flexDirection:'row',minWidth:12,height:12,marginLeft:-5,marginTop:-14,borderRadius:6}}>
                <Text numberOfLines={1} style={{color:'#ffffff',minWidth:10,marginLeft:1,marginRight:1,fontSize:9,backgroundColor:'transparent',textAlign:'center',height:12,lineHeight:12}}>
                    {this.props.messageNum}</Text>
            </View>}
        </View>)
    }

    _renderRightView(){


        return(
                <View style = {styles.rightViewStyle}>
                    <Image resizeMode = "center" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
                    <Text numberOfLines={2} style = {[styles.leftTextStyle]}>{this.props.leftText}</Text>
                </View>
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
    },

    leftViewStyle:{
        // 主轴的方向
        marginLeft:15,
        marginRight:15,
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
        flex:1,
        flexDirection:'row-reverse',
        // 侧轴居中
        alignItems:'center',
    },

    leftImgStyle:{ // 左边的图片
    },

    leftTextStyle:{
        flex:1,
        marginLeft:2,
        marginRight:1,
        fontSize:16,
        color:'#333333'
    },

    rightImgStyle:{ // 左边的图片
        width:26,
        height:26
    },

    rightTextStyle:{
        fontSize:14,
        color:'#999999'
    }

});
