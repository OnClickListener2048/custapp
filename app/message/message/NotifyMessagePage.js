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
import moment from 'moment';

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
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };


    onNavigatorEvent(event) {

        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {
            this.listener = this.refreshEmitter = DeviceEventEmitter.addListener('ReloadNotifyMessageList', () => {
                this._isLogined();
            });
        }
        if(event.id === 'willDisappear'){
            this.listener.remove();
        }
    }

    componentDidMount() {
        this._isLogined();
    }

    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {

                if (logined === true){
                    this.refreshListData();
                }else {
                    this.setState({
                        initStatus:'no-data'
                    })
                }
            },
            e => {
            }
        );
    }



    refreshListData(){
        UserInfoStore.getNotifyMessageArr().then(
            (messageArr) => {
                if (messageArr && messageArr.length > 0) {

                    for (let i = 0 ; i < messageArr.length ; i++){
                        let item = messageArr[i];
                        const currentTimestamp = new Date().getTime();

                        var todayZeroTime = new Date(new Date().setHours(0, 0, 0, 0));  //今天零点的时间

                        let timeMinus = (currentTimestamp - item.timeTamp) / 1000;  //数据的时间差值

                        let todayTimeMinus = (currentTimestamp - todayZeroTime) / 1000;   //今天天的差值

                        let yesterdayTimeMinus = todayTimeMinus + 86400;   //昨天的差值 一天是86400秒



                        var today2 = new Date();//获得当前日期
                        var theYear = today2.getFullYear();//获得年份
                        var theMonth = today2.getMonth();//此方法获得的月份是从0---11，所以要加1才是当前月份



                        var yearZeroTime = new Date(new Date().setFullYear(theYear,0,0));

                        var monthZeroTime = new Date(new Date().setMonth(theMonth,0));

                        let monthTimeMinus = (currentTimestamp - monthZeroTime) / 1000;   //当月的差值

                        let yearTimeMinus = (currentTimestamp - yearZeroTime) / 1000;   //当年的差值


                        if (timeMinus <= todayTimeMinus){
                            //今天的
                            let  todayTime = moment(item.timeTamp).format("HH:mm")

                            item.createDate = todayTime;

                        }else if (timeMinus  <= yesterdayTimeMinus){
                            //昨天的
                            let  todayTime = moment(item.timeTamp).format("HH:mm")

                            item.createDate = '昨天' + todayTime;
                        }else if (timeMinus  <= monthTimeMinus){
                            //昨天的
                            let  todayTime = moment(item.timeTamp).format("DD日 HH:mm")

                            item.createDate = todayTime;
                        }else if (timeMinus  <= yesterdayTimeMinus){
                            //昨天的
                            let  todayTime = moment(item.timeTamp).format("MM月DD日 HH:mm")

                            item.createDate = '昨天' + todayTime;
                        }else {
                            //正常显示

                            let  todayTime = moment(item.timeTamp).format("YYYY年MM月DD日 HH:mm")

                            item.createDate = todayTime;
                        }


                    }


                        this.setState({
                            initStatus:'initSucess',
                            dataList : messageArr,
                            refreshState : RefreshState.NoMoreData,
                        });
                }else{
                        this.setState({
                            initStatus:'no-data'
                        })
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
            this._jumpWithUrl(item);
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
                this._jumpWithUrl.bind(this,item);
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
                     img={info.item.img}
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
                        onHeaderRefresh={this.refreshListData.bind(this)}
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
