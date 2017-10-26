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
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        }
        this.page =1



    }

    componentDidMount() {
        //打开即可
        // if(!NetInfoSingleton.isConnected) {
        //     this.setState({
        //         initStatus:'no-net'
        //     })
        // }else{
        //     this.onHeaderRefresh()
        //
        // }

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

        if(!NetInfoSingleton.isConnected) {
           return;
        }

        if(page===1){
            this.setState({refreshState: RefreshState.HeaderRefreshing})

        }else{
            this.setState({refreshState: RefreshState.FooterRefreshing})
        }

        apis.loadMessageData(pageSize,page).then(
            (responseData) => {

                if(responseData.code == 0){


                    let newList = responseData.list

                    let dataList = page === 1 ? newList : [...this.state.dataList, ...newList]
                    this.setState({
                        dataList: dataList,
                        refreshState:responseData.list.length < pageSize ? RefreshState.NoMoreData : RefreshState.Idle,
                    })

                    if (page === 1 && this.state.dataList.length === 0){

                        this.setState({
                            initStatus:'no-data'
                        })

                    }else if (this.state.initStatus !== 'initSucess'){
                        this.setState({
                            initStatus:'initSucess'
                        })
                    }

                }else{

                    if (this.state.dataList.length === 0){
                        this.setState({
                            initStatus:'error'
                        })
                    }
                    this.setState({refreshState: RefreshState.Failure})
                }
            },
            (e) => {
                if (this.state.dataList.length === 0){
                    this.setState({
                        initStatus:'error'
                    })
                }

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
                <TouchableOpacity onPress={this._goto.bind(this,info.item)}>
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

                    if (this.state.dataList.length === 0){
                        this.setState({
                            initStatus:'no-data'
                        })
                    }

                }else{
                }
            },
            (e) => {

            },
        );




    }
    _goto(item){

        this.props.navigator.push({
            screen: 'SystemMessagePage',
            title:'消息详情',
            passProps:{
                item
            }
        });

    }



    render() {

        return(
            <DefaultView onPress={()=>this.onHeaderRefresh()} type ={'no-MessageData'}/>
        )
        //打开即可

        // if(this.state.initStatus === 'initSucess') {
        //     return (
        //         <View style={styles.container}>
        //             <RefreshListView
        //                 data={this.state.dataList}
        //                 keyExtractor = {(item, index) => index}
        //                 renderItem={this.renderCell.bind(this)}
        //                 refreshState={this.state.refreshState}
        //                 onHeaderRefresh={this.onHeaderRefresh}
        //                 onFooterRefresh={this.onFooterRefresh}
        //                 contentContainerStyle={{paddingTop:20,backgroundColor:'#f9f9f9'}}
        //             />
        //         </View>
        //     )
        // }else {
        //     return(
        //         <DefaultView onPress={()=>this.onHeaderRefresh()} type ={this.state.initStatus}/>
        //     )
        // }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'#f9f9f9'
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
})