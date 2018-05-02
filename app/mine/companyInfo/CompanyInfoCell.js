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
                style = {[styles.container,{height:(this.props.ownerText.length > 0 &&this.props.ownerText=='拥有者')?80:50},underlineStyle,this.props.underLineStyle,this.props.style]}>
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
        // let tipBtnCount = 0;
        // if (this.props.surviveText.length > 0){
        //     tipBtnCount++;
        // }
        // if (this.props.ownerText.length > 0){
        //     tipBtnCount++;
        // }

        // return(
        //     <TouchableOpacity style={[styles.rightViewStyle]} onPress = {() => {this.props.rightBtnOnPress()}}>
        //         <View style = {styles.rightViewStyle}>
        //             <Image resizeMode = "center" style = {styles.rightImgStyle} source={require('../../img/left_button.png')} />
        //             {tipBtnCount > 0 &&
        //             <View style={{width: 47 * tipBtnCount, flexDirection: 'row', alignItems: 'center',}}>
        //                 {this.props.surviveText.length > 0 && <View style={{
        //                     marginLeft: 5, width: 42, borderRadius: 2, height: 20, backgroundColor: '#B0B0B0',
        //                     justifyContent: 'center'
        //                 }}>
        //                     <Text style={{
        //                         color: '#ffffff',
        //                         textAlign: 'center',
        //                         fontSize: 10
        //                     }}>{this.props.surviveText}</Text>
        //                 </View>
        //                 }
        //
        //                 {this.props.ownerText.length > 0 &&this.props.ownerText=='被授权'&&
        //                 <View style={{
        //                     marginLeft: 5, width: 42, borderRadius: 2, height: 20, backgroundColor: '#B0B0B0',
        //                     justifyContent: 'center'
        //                 }}>
        //                     <Text style={{
        //                         color: '#ffffff',
        //                         textAlign: 'center',
        //                         fontSize: 10
        //                     }}>{this.props.ownerText}</Text>
        //                 </View>
        //                 }
        //
        //                 {this.props.ownerText.length > 0 &&this.props.ownerText=='拥有者'&&
        //                 <TouchableOpacity onPress={()=>{this.props.authorizeButton()}}
        //                     style={{
        //                     marginLeft: 5, width: 42, borderRadius: 2, height: 20, backgroundColor: '#E2D4B7',
        //                     justifyContent: 'center'
        //                 }}>
        //                     <Text style={{
        //                         color: '#ffffff',
        //                         textAlign: 'center',
        //                         fontSize: 10
        //                     }}>授权</Text>
        //                 </TouchableOpacity>
        //                 }
        //
        //             </View>
        //             }
        //             <Text numberOfLines={2} style = {[styles.leftTextStyle]}>{this.props.leftText}</Text>
        //         </View>
        //     </TouchableOpacity>
        // );
        return(
            <TouchableOpacity style={[styles.rightViewStyle]} onPress = {() => {this.props.rightBtnOnPress()}}>
                <View style = {styles.wrap1}>
                    <Text accessibilityLabel="company_left" testID="company_left"
                          numberOfLines={2} style = {[styles.leftTextStyle]}>{this.props.leftText}</Text>
                   <View style={styles.heng}>
                    {this.props.ownerText.length > 0 &&
                    <Text accessibilityLabel="company_state2" testID="company_state2"
                          style = {[styles.ownerText]}>{this.props.ownerText}</Text>}
                    {this.props.surviveText.length > 0 &&
                    <Text accessibilityLabel="company_state1" testID="company_state1"
                          style = {[styles.surviveText]}>{this.props.surviveText}</Text>}
                   </View>



                </View>
                <View style = {styles.wrap2}>

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
        // alignItems:'center',
    },
    wrap1:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginRight:20,
        alignItems:'center',
    },
    wrap2:{
        flexDirection:'row-reverse',
        justifyContent:'space-between',
        marginRight:20
    },

    leftImgStyle:{ // 左边的图片
    },

    leftTextStyle:{
        flex:1,
        marginLeft:2,
        marginRight:1,
        fontSize:16,
        color:'#333333',
        marginTop:Platform.OS==='ios'?4:0
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
        marginTop:Platform.OS==='ios'?4:0
    },
    ownerText:{
        fontSize:14,
        color:'#999999',
        marginLeft:2,
        marginTop:Platform.OS==='ios'?4:0
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
        marginTop: 10,
        marginRight:20
    },
    shouquanText:{
        color:'#CEAF72',
        fontSize:14,
    },
    heng:{
        flexDirection:'row'
    }
});
