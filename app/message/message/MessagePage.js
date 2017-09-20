/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity
} from 'react-native';
import CommonCell from '../../view/CommenCell'
import UltimateListView from "react-native-ultimate-listview";
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';

export default class MessagePage extends BComponent {
    constructor(props) {
        super(props);
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
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
       // alert(JSON.stringify(item))
        return(
            <Swipeout right={[
                {
                    text: '删除',
                    backgroundColor:'red',
                    onPress:this._delete.bind(this,index)
                }
            ]}
                      autoClose={true}
            >
                <TouchableOpacity onPress={this._goto.bind(this)}>
                    <CommonCell
                        leftText={item.title }
                        rightText={item.date}
                        isClick={false}
                    />
                </TouchableOpacity>

            </Swipeout>

        )
    };

    _delete(index){
        let arr = JSON.parse(JSON.stringify(this.listView.getRows()))
        arr.splice(index,1)
        this.listView.updateDataSource(arr);
    }
    _goto(){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
        });

    }
    renderPaginationFetchingView = () => {
        return (
            <View></View>
        );
    };
    render() {
        return (
            <View style={{flex:1}}>
                <UltimateListView
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`}  //this is required when you are using FlatList
                    refreshableMode={DeviceInfo.OS==='ios'?'advanced':'basic'} //basic or advanced
                    item={this.renderItem}  //this takes three params (item, index, separator)
                    paginationFetchingView={this.renderPaginationFetchingView}
                />
            </View>
        );
    }



}