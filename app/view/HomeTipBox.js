/**
 * Created by jinglan on 2018/1/22.
 */

import React from 'react';
import {Platform, View, Text,Image,TouchableOpacity,
    NativeModules} from 'react-native';
import BComponent from '../base/BComponent'
import DeviceInfo from 'react-native-device-info';
import {deviceHeight,deviceWidth} from "../util/ScreenUtil";
import pushJump from '../util/pushJump';

// 升级弹窗
export default class HomeTipBox extends BComponent {

    constructor(props) {
        super(props);

    }
    static defaultProps = {
        boxId:'',
        isLogin:true,
        imgUrl:'',
        jumpUrl:'',
        imgHeight: 0,
        imgWidth:0
    };

    render() {
        return (
            <TouchableOpacity style={{justifyContent:'center',alignItems:'center',width:deviceWidth,height:deviceHeight}} onPress={()=>{this._cancelBtnClick()}}>

            <View style={{justifyContent:'center',alignItems:'center',width:deviceWidth,height:deviceHeight}}>
                {this.props.imgUrl !== null && (this.props.imgUrl !== undefined) && (this.props.imgUrl.length>0) &&

                <View style={{width:this.props.imgWidth * 375 / deviceWidth - 10 , height:40,flexDirection:'row-reverse'}}>
                    <TouchableOpacity style={{width:40, height:40,justifyContent:'center',alignItems:'center'}} onPress={()=>{this._cancelBtnClick()}}>

                        <Image resizeMode="contain"
                                source={require('../img/close_btn.png')}>
                        </Image>
                     </TouchableOpacity>
                </View>
                }
                {this.props.imgUrl !== null && (this.props.imgUrl !== undefined) && (this.props.imgUrl.length>0) &&

                <TouchableOpacity onPress={()=>{this._clickToServicePageBtn()}} style={{width:this.props.imgWidth * 375 / deviceWidth , height: this.props.imgHeight * 375 / deviceWidth}}>

                    <Image resizeMode="contain" style={{width:this.props.imgWidth * 375 / deviceWidth , height: this.props.imgHeight * 375 / deviceWidth }}
                           source={{uri: this.props.imgUrl}}>
                    </Image>
                </TouchableOpacity>
                }




            </View>
            </TouchableOpacity>

        );
    }


    _clickToServicePageBtn(){

        let callback = this.props.callback;
        if(callback) {
            callback(this.props.boxId,this.props.isLogin,this.props.jumpUrl);
        }


        this.props.navigator.dismissLightBox()

    }

    _cancelBtnClick(){
        this.props.navigator.dismissLightBox()

    }

}