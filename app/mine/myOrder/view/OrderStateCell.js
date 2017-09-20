/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CommenCell from "../../../view/CommenCell";

export default class OrderStateCell extends Component {

    render(){
        return
        <View style={styles.container} >
            <CommenCell
                leftText="订单号:20170919"
                rightText="待分配"
                rightTextStyle={{color:'#e13238'}}
                />
        </View>
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F9F9F9'
    }

});