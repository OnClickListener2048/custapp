/**
 * Created by liufei on 2018/1/22.
 */


import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import SubmitButton from "../../view/SubmitButton";
import CheckInfoItemFour from "../../view/CheckInfoItemFour";

import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';

export default class TestPage extends Component {


    render(){
        return(
            <View>
                <CheckInfoItemFour
                    name1="单位"
                    value1="元"
                    name2="数量"
                    value2="500"
                    isShowLine={true}
                />

                <View style={{marginRight:100,marginLeft:100}}>
                <SubmitButtonWithIcon
                    isEnabled={true}
                    text="开始扫描"
                    img={require('../../img/scan_icon.png')}


                />
                </View>
                <SubmitButton
                    isEnabled={false}
                    text="手工录入查验"

                />
            </View>
        )
    }
}







