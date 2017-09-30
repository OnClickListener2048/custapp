/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import CommonCell from '../../view/CommenCell'
import UltimateListView from "react-native-ultimate-listview";
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
const data = [
    {
        title:'系统消息',
        date:'2017-3-10'
    },
]
export default class MessagePage extends BComponent {
    constructor(props) {
        super(props);
        this.state={
            fetchState:'no-data'
        }
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };


    // 载入初始化数据
    onFetch = (page = 1, startFetch, abortFetch) => {


        let pageSize = 10;
        abortFetch([],page * pageSize)
        apis.loadMessageData(pageSize,page).then(
            (responseData) => {


                if((responseData !== null && responseData.data !== null)){

                    console.log('messageresponseDataData',responseData)
                    startFetch(responseData.list,page * pageSize)

                }else{
                    abortFetch()
                    this.setState({
                        fetchState:'error'
                    })
                }
            },
            (e) => {

                console.log('messageresponseDataError',e)

                abortFetch()
                this.setState({
                    fetchState:'error'
                })
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
                    onPress:this._delete.bind(this,index,item)
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

    _delete(index,item){
        let arr = JSON.parse(JSON.stringify(this.listView.getRows()))
        arr.splice(index,1)
        this.listView.updateDataSource(arr);
    }
    _goto(){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
            title:'系统消息'
        });

    }
    renderPaginationFetchingView = () => {

        if(!NetInfoSingleton.isConnected){
            return (
                <DefaultView type='no-net' onPress={this.refresh.bind(this)}/>
            );
        }else{
            return (
                <DefaultView type={this.state.fetchState} onPress={this.refresh.bind(this)}/>
            );
        }
        //第一次请求是占位图

    };
    emptyView = () =>{
        //第一次请求没数据的空页面
        return(
            <DefaultView type="no-data" onPress={this.refresh.bind(this)}/>
        )
    }
    refresh(){
        this.listView.refresh()
    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <UltimateListView
                    contentContainerStyle={{marginTop:10}}
                    ref={(ref) => this.listView = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => `${index} - ${item}`}  //this is required when you are using FlatList
                    refreshableMode={DeviceInfo.OS==='ios'?'advanced':'basic'} //basic or advanced
                    item={this.renderItem}  //this takes three params (item, index, separator)
                    paginationFetchingView={this.renderPaginationFetchingView}
                    emptyView={this.emptyView}
                />
            </View>
        );
    }



}