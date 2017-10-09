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
    RefreshControl,
    FlatList
} from 'react-native';
import OrderStateCell from "./view/OrderStateCell";

export default class MyOrderStatePage extends Component {

    constructor(props){
        super(props)
        this.pageX = '';
        this.pageY = ''
    }

    static defaultProps = {
        sourceData: [],
    }


    renderItem = (item, index, separator) => {
        console.log('item222222',item)

        return(
            <OrderStateCell
                orderId={item.item.order_no}
                orderState={item.item.status_desc}
                money={item.item.amount}
                time={item.item.order_time}
                {...this.props}
            />
        )
    };


    render(){
        const {sourceData} = this.props
        return(
        <View style={styles.container}>
            <FlatList
                ref={(ref) => this.listView = ref}
                data={sourceData}

                renderItem={this.renderItem}  //this takes three params (item, index, separator)

                //解决ScrollableTabView和listView的滑动冲突
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