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
    ScrollView,
    ListView,
    RefreshControl
} from 'react-native';
import OrderStateCell from "./view/OrderStateCell";
import UltimateListView from "react-native-ultimate-listview";
import * as apis from '../../apis';
import CommonCell from '../../view/CommenCell'

export default class MyOrderStatePage extends Component {

    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2}),
        }
        this.orderArr=[];
        this.pageX = '';
        this.pageY = ''
    }

    // 载入初始化数据
    onFetch = (page = 1, startFetch, abortFetch) => {
        let mesId = ''

        if (page >1){
            let arr = this.listView.getRows()
            let obj = arr[arr.length-1]
            mesId = obj.msgId
        }
        let pageSize = 10
        apis.loadMessageData(pageSize,mesId).then(
            (responseData) => {

                if(responseData !== null && responseData.data !== null){

                    startFetch(responseData.data,page * pageSize)
                }else{

                    abortFetch()
                }
            },
            (e) => {

                abortFetch()

            },
        );
    };

    renderItem = (item, index, separator) => {

        return(
            <OrderStateCell
                headImg={require('../../img/head_img.png')}
                orderId={item.msgId}
                orderState={item.title}
                name={item.subTitle}
                money="200"
                {...this.props}
            />


        )
    };

    renderPaginationFetchingView = () => {
        return (
            <View></View>
        );
    };

    render(){
        return(
        <View style={styles.container}>
            <UltimateListView
                ref={(ref) => this.listView = ref}
                onFetch={this.onFetch}
                keyExtractor={(item, index) => `${index} - ${item}`}  //this is required when you are using FlatList
                refreshableMode={DeviceInfo.OS==='ios'?'advanced':'basic'} //basic or advanced
                item={this.renderItem}  //this takes three params (item, index, separator)
                paginationFetchingView={this.renderPaginationFetchingView}
                onTouchStart={(e) => {
                    this.pageX = e.nativeEvent.pageX;
                    this.pageY = e.nativeEvent.pageY;
                }}
                onTouchMove={(e) => {
                    if(Math.abs(this.pageY - e.nativeEvent.pageY) > Math.abs(this.pageX - e.nativeEvent.pageX)){
                        // 下拉
                        this.props.lockSlide();
                    } else {
                        // 左右滑动
                        this.props.openSlide();

                    }
                }}
            />
        </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    }
});