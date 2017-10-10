/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Platform,
    StyleSheet
} from 'react-native';
import CommonCell from '../../view/CommenCell'
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import RefreshListView, {RefreshState} from '../../view/RefreshListView'
export default class MessagePage extends BComponent {

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    constructor(props) {
        super(props)

        this.state = {
            dataList: [],
            refreshState: RefreshState.Idle,
        }
        this.page =1
    }

    componentDidMount() {
        this.onHeaderRefresh()
    }

    onHeaderRefresh = () => {
        this.page=1
        this.loadData(this.page)
    }

    onFooterRefresh = () => {
        this.page++
        this.loadData(this.page)
    }

    loadData(page=1,pageSize=15){

        if(page==1){
            this.setState({refreshState: RefreshState.HeaderRefreshing})

        }else{
            this.setState({refreshState: RefreshState.FooterRefreshing})
        }

        apis.loadMessageData(pageSize,page).then(
            (responseData) => {

                if(responseData.code == 0){

                    let newList = responseData.list

                    let dataList = page == 1 ? newList : [...this.state.dataList, ...newList]
                    this.setState({
                        dataList: dataList,
                        refreshState:dataList.length > 50 ? RefreshState.NoMoreData : RefreshState.Idle,
                    })

                }else{
                    this.setState({refreshState: RefreshState.Failure})
                }
            },
            (e) => {
                this.setState({refreshState: RefreshState.Failure})
            },
        );
    }

    renderCell = (info) => {
        return(
            <Swipeout right={[
                {
                    text: '删除',
                    backgroundColor:'red',
                    onPress:this._delete.bind(this,info.index,info.item)
                }
            ]}
                      autoClose={true}
            >
                <TouchableOpacity onPress={this._goto.bind(this)}>
                    <CommonCell
                        leftText={info.item.title == undefined?info.item.name:info.item.title }
                        rightText={info.item.date}
                        isClick={false}
                    />
                </TouchableOpacity>

            </Swipeout>

        )
    }
    _delete(index,item){

        console.log(item + "rrrr" +item._id)

        apis.deleteMessageItem(item._id).then(
            (responseData) => {

                if(responseData.code == 0){

                    let arr = JSON.parse(JSON.stringify(this.state.dataList))
                    arr.splice(index,1)
                    this.setState({
                        dataList:arr
                    })

                }else{
                    alert('1' + responseData.code)
                }
            },
            (e) => {
                alert('2')

            },
        );




    }
    _goto(){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
            title:'系统消息'
        });

    }

    render() {
        return (
            <View style={styles.container}>
                <RefreshListView
                    data={this.state.dataList}
                    keyExtractor = {(item, index) => index}
                    renderItem={this.renderCell.bind(this)}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 20 : 0,
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
})