/**
 * Created by jinglan on 2018/1/22.
 */

import React from 'react';
import {Platform, View, Text,Image,TouchableOpacity,
    NativeModules} from 'react-native';
import BComponent from '../base/BComponent'
import DeviceInfo from 'react-native-device-info';
import {deviceHeight,deviceWidth} from "../util/ScreenUtil";
const contentwidth = deviceWidth*0.7
import pushJump from '../util/pushJump';

// 升级弹窗
export default class HomeTipBox extends BComponent {

    constructor(props) {
        super(props);

    }
    static defaultProps = {
        isLogin:true,
        imgUrl:'',
        jumpUrl:'',
        imgHeight: 0,
        imgWidth:0
    };

    render() {
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                    {this.props.imgUrl !== null && (this.props.imgUrl !== undefined) && (this.props.imgUrl.length>0) &&
                    <TouchableOpacity onPress={()=>{this._clickToServicePageBtn()}} style={{width:deviceWidth - 60 , height: ((deviceWidth - 60)  * this.props.imgHeight ) / this.props.imgWidth}}>

                    <Image resizeMode="stretch" style={{width:deviceWidth - 60 , height: ((deviceWidth - 60)  * this.props.imgHeight ) / this.props.imgWidth}}
                           source={{uri: this.props.imgUrl}}>
                    </Image>
                    </TouchableOpacity>
                    }



            </View>
        );
    }


    _clickToServicePageBtn(){

        //pushJump(this.props.navigator, this.props.jumpUrl);
        // pushJump(this.props.navigator, this.props.jumpUrl,'噼里啪智能财税','噼里啪智能财税','噼里啪智能财税');

        let callback = this.props.callback;
        if(callback) {
            callback(this.props.isLogin,this.props.jumpUrl);
        }


        this.props.navigator.dismissLightBox()

    }

    _cancelBtnClick(){

    }

}