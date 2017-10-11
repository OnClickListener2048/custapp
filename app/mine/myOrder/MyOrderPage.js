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
    ScrollView,
} from 'react-native';

import  MyOrderStatePage from './MyOrderStatePage'
import OrderStateCell from "./view/OrderStateCell";
import BComponent from '../../base/BComponent'
import * as apis from '../../apis';
import HudView from '../../view/HudView'

export default class MyOrderPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:[],//全部
            doing:[],//进行中
            hang:[],//挂起
            done:[]//已结束
        };
    }

    componentDidMount() {
        apis.loadOrderListData().then(
            (responseData) => {
                if(responseData.code == 0) {
                    var data = responseData.list;
                    var hang=[];
                    var done=[];
                    var doing=[];
                    for (let i = 0; i<data.length;i++){
                        if(data[i].status==5) {
                            hang.push(data[i]);
                        }else if(data[i].status==6){
                            done.push(data[i]);
                        }else {
                            doing.push(data[i])
                        }
                    }
                    this.setState({
                        data:data,
                        doing:doing,
                        hang:hang,
                        done:done
                        }
                    );
                }
            },
            (e) => {
                console.log('error',e)

            },
        );
    }


    _lockSlide(){
        if (Platform.OS === 'android') {
            this.scrollTabView.setNativeProps(false);
        }
    }

    _openSlide(){
        if (Platform.OS === 'android'){
            this.scrollTabView.setNativeProps(true);
        }
    }


    render(){
        return(
        <ScrollableTabView
            renderTabBar={() => <CustomTabBar/>}
            style={styles.container}
            tabBarUnderlineStyle={styles.lineStyle}//选中时线的样式
            tabBarActiveTextColor='#E13238'//选中时字体的颜色
            tabBarBackgroundColor='#ececec'//整个tab的背景色
            tabBarInactiveTextColor='#999999'//未选中时字的颜色
            tabBarTextStyle={styles.textStyle}//tab字体的样式
            ref={(scrollTabView) => { this.scrollTabView = scrollTabView; }}
        >
            <MyOrderStatePage tabLabel='进行中'
                              sourceData={this.state.doing}
                              lockSlide = {this._lockSlide.bind(this)} //解决ScrollableTabView和listView的滑动冲突
                              openSlide = {this._openSlide.bind(this)}
                              {...this.props}//把所有属性都传给子页面

                              />
            <MyOrderStatePage tabLabel='挂起'
                              sourceData={this.state.hang}
                              lockSlide = {this._lockSlide.bind(this)}
                              openSlide = {this._openSlide.bind(this)}
                              {...this.props}
            />
            <MyOrderStatePage tabLabel='已结束'
                              sourceData={this.state.done}
                              lockSlide = {this._lockSlide.bind(this)}
                              openSlide = {this._openSlide.bind(this)}
                              {...this.props}
            />
            <MyOrderStatePage tabLabel='全部'
                              sourceData={this.state.data}
                              lockSlide = {this._lockSlide.bind(this)}
                              openSlide = {this._openSlide.bind(this)}
                              {...this.props}
            />
        </ScrollableTabView>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f9f9f9',
        paddingTop:10

    },

    lineStyle: {
        // height: 1,
        backgroundColor: '#E13238',
    },

    textStyle:{
        fontSize:16,
        marginTop:10
    }

});