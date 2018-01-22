/**
 * Created by liufei on 2018/1/22.
 */


import CheckInfoItemTwo from "../../view/CheckInfoItemTwo";
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

                <CheckInfoItemTwo
                    name="名称"
                    value="北京科技有限公司"
                    isShowLine={true}
                />
            </View>
        )
    }
}







