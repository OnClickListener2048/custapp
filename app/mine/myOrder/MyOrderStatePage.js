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
import DefaultView from '../../view/DefaultView'
export default class MyOrderStatePage extends Component {

    constructor(props){
        super(props)
        this.pageX = '';
        this.pageY = ''
    }

    static defaultProps = {
        sourceData: [],
    }


    renderItem = (item) => {
        console.log('item222222',item)

        return(
            <OrderStateCell
                orderId={item.item.order_no}
                orderState={item.item.status_desc}
                money={item.item.amount}
                time={item.item.order_time}
                id={item.item.order_id}
                order_type={item.item.order_type}
                statusW={item.item.status}
                orderItem={item.item}

                {...this.props}
            />
        )
    };

    _keyExtractor = (item, index) => index;//唯一不同的index作为key

    render(){
        const {sourceData} = this.props
        console.log('sourceData========',sourceData)

        if(sourceData.length!=0) {
            return (
                <View style={styles.container}>
                    <FlatList
                        ref={(ref) => this.listView = ref}
                        data={sourceData}

                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}//为每个item添加唯一的key

                        //解决ScrollableTabView和listView的滑动冲突
                        onTouchStart={(e) => {
                            this.pageX = e.nativeEvent.pageX;
                            this.pageY = e.nativeEvent.pageY;
                        }}
                        onTouchMove={(e) => {
                            if (Math.abs(this.pageY - e.nativeEvent.pageY) > Math.abs(this.pageX - e.nativeEvent.pageX)) {
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
        }else{
            return(
                <DefaultView type ='no-data'/>
            )
        }
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    }
});