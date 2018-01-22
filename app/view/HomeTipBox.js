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

// 升级弹窗
export default class HomeTipBox extends BComponent {

    constructor(props) {
        super(props);

    }
    static defaultProps = {
        imgUrl:'',
        jumpUrl:'',
        imgHeight: 0,
        imgWidth:0
    };

    render() {
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                    {this.props.imgUrl !== null && (this.props.imgUrl !== undefined) && (this.props.imgUrl.length>0) &&
                    <Image resizeMode="center" style={{width:deviceWidth - 20 , height: (deviceWidth - 20) / this.props.imgWidth * this.props.imgHeight}}
                           source={{uri: this.props.imgUrl}}>
                    </Image>
                    }



            </View>
        );
    }


}