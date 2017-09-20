/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
const dismissKeyboard = require('dismissKeyboard');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CustomTabBar from './view/CustomTabBar'
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import  MyOrderStatePage from './MyOrderStatePage'
import OrderStateCell from "./view/OrderStateCell";

export default class MinePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render(){
        return <ScrollableTabView
            renderTabBar={() => <CustomTabBar/>}
            style={styles.container}
            tabBarUnderlineStyle={styles.lineStyle}//选中时线的样式
            tabBarActiveTextColor='#E13238'//选中时字体的颜色
            tabBarBackgroundColor='#ececec'//整个tab的背景色
            tabBarInactiveTextColor='#999999'//未选中时字的颜色
            tabBarTextStyle={styles.textStyle}//tab字体的样式
            ref={(tabView) => { this.tabView = tabView; }}
        >
            {/*<MyOrderStatePage tabLabel='办理中'/>*/}
            {/*<MyOrderStatePage tabLabel='已完成'/>*/}
            {/*<MyOrderStatePage tabLabel='已取消'/>*/}
            {/*<MyOrderStatePage tabLabel='全部'/>*/}
            <OrderStateCell tabLabel='办理中'/>
            <OrderStateCell tabLabel='已完成'/>
            <OrderStateCell tabLabel='已取消'/>
            <OrderStateCell tabLabel='全部'/>

        </ScrollableTabView>
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f9f9f9',
        paddingTop:10

    },

    lineStyle: {
        alignSelf:'center',
        width:SCREEN_WIDTH/4-13*2,
        height: 1,
        marginLeft:15,
        backgroundColor: '#E13238',
    },

    textStyle:{
        fontSize:16,
        marginTop:10
    }

});