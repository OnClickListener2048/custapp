/**
 * Created by jinglan on 2018/1/12.
 */
/**
 * Created by jinglan on 2018/1/12.
 */

import React, {Component} from 'react';
import pushJump from '../../util/pushJump';

import {
    View,
    TouchableOpacity,
    Text,
    Platform,
    DeviceEventEmitter,
    NativeAppEventEmitter,
    StyleSheet
} from 'react-native';
import MessageCustomCell from './MessageCell'
import JPushModule from 'jpush-react-native';
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import Toast from 'react-native-root-toast';

import RefreshListView, {RefreshState} from '../../view/RefreshListView'
export default class NotifyMessagePage extends BComponent {

    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            unReadNum: 0,
            logined : false,
            isAppear : false,
            refreshState: RefreshState.Idle,
            jpushMessage:'',
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        };
        this.page =1;
    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };




    componentDidMount() {
        this.refreshListData();

        this.refreshEmitter = DeviceEventEmitter.addListener('ReloadMessage', () => {
            //收到登录后的通知需要刷新消息页面
            this.onHeaderRefresh();
            //如果在消息页面则不显示badge红点提示,否则要在消息的tab显示红点数字提示
            if (this.state.isAppear === true){
                this.props.navigator.setTabBadge({
                    badge: null
                });
            }else {
                this._loadUnreadedNum();
            }
        });

        this.refreshEmitter = DeviceEventEmitter.addListener('ClearMessage', () => {
            //收到退出后的通知需要清空消息页面,并置badge为空不提示红点
            this.props.navigator.setTabBadge({
                badge: null
            });
            this.setState({
                initStatus:'no-data'
            })
        });

    }





    refreshListData(){

        UserInfoStore.getNotifyMessageArr().then(
            (messageArr) => {

                if (messageArr) {

                    if (messageArr.length > 0){
                        this.setState({
                            initStatus:'initSucess',
                            dataList : messageArr,
                            refreshState : RefreshState.NoMoreData,
                        });
                    }else if (messageArr.length === 0){
                        this.setState({
                            initStatus:'no-data'
                        })
                    }
                }
            },
            (e) => {

                this.setState({
                    initStatus:'error'
                })

            },
        );
    }



    _jumpWithUrl(item){

        pushJump(this.props.navigator, item.url,item.title?item.title:'噼里啪智能财税',item.title?item.title:'噼里啪智能财税',item.content);
    }

    _readed(item){

        if (item.readed === true){
            return;
        }


        item.readed = true;
        let data = [];
        this.state.dataList.forEach(row => {
            data.push(Object.assign({}, row));
        });

        this.setState({
            dataList:data,
        });


        UserInfoStore.setNotifyMessageArr(data).then(
            (data) => {
                this._jumpWithUrl.bind(item);
                console.log("保存新是否已读的数据:", data);

            },
            (e) => {
            },
        );
    }

    renderCell = (info) => {
        return(
            <TouchableOpacity onPress={this._readed.bind(this,info.item)}>
                <MessageCustomCell
                    messageTitle={info.item.title}
                    messageSubTitle={info.item.content}
                    messageTime={info.item.createDate}
                    isRead={info.item.readed}
                />
            </TouchableOpacity>
        )
    };

    render() {

        if(this.state.initStatus === 'initSucess') {
            return (
                <View style={styles.container}>
                    <RefreshListView
                        data={this.state.dataList}
                        keyExtractor = {(item, index) => index}
                        renderItem={this.renderCell.bind(this)}
                        refreshState={this.state.refreshState}
                        contentContainerStyle={{paddingTop:10,backgroundColor:'#f1f1f1'}}
                        isheaderrefresh={false}
                    />
                </View>
            )
        }else {
            return(
                <DefaultView  type ={this.state.initStatus}/>
            )
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'#F1F1F1'
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
});
