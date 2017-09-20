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

export default class MyOrderStatePage extends Component {

    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2}),
        }
        this.orderArr=[];
        this._loadInitData=this._loadInitData.bind(this);
    }

    componentWillMount(){
        this._loadInitData();
    }

    _loadInitData(){

    }

    render(){
        return(
        <View style={styles.container}>
            <ListView    style={[{flex : 1 }]}
                         dataSource={this.state.dataSource}
                         // onEndReached={this._loadMoreData}
                         // renderFooter={this.renderFooter}
                         enableEmptySections={true}
                         onEndReachedThreshold={10}
                         renderRow={this._renderRow.bind(this)}

            />
        </View>
        )
    }

    _renderRow(rowData){
        return(
            <OrderStateCell
                headImg={require('../../img/head_img.png')}
                orderId='20170920'
                orderState="待分配"
                name="注册公司"
                money="200"
            />
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    }
});