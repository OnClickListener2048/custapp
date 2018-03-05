

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
import InvoiceTitleCell from './InvoiceTitleCell'
import JPushModule from 'jpush-react-native';
import Swipeout from "react-native-swipeout"
import * as apis from '../../apis';
import BComponent from '../../base';
import DefaultView from '../../view/DefaultView'
import Toast from 'react-native-root-toast';
import SubmitButton from "../../view/SubmitButton";

import RefreshListView, {RefreshState} from '../../view/RefreshListView'
export default class InvoiceTitleListPage extends BComponent {

    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
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

        }

    }
    componentDidMount() {
        //打开即可
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            })
        }else{
            this._isLogined();
        }

        this.refreshEmitter = DeviceEventEmitter.addListener('ReloadMessage', () => {
            //收到登录后的通知需要刷新消息页面
            this.onHeaderRefresh();
        });

        this.refreshEmitter = DeviceEventEmitter.addListener('ClearMessage', () => {
            //收到退出后的通知需要清空消息页面,并置badge为空不提示红点
            this.setState({
                initStatus:'no-data'
            })
        });

    }

    _isLogined(){
        UserInfoStore.isLogined().then(
            logined => {
                this.setState({logined:logined});
                if (logined === true){
                    this.onHeaderRefresh();

                }else {
                    this.setState({
                        initStatus:'no-data'
                    });

                }
            },
            e => {

            }
        );
    }





    loadData(){

        if(!NetInfoSingleton.isConnected) {
            return;
        }

        this.setState({refreshState: RefreshState.HeaderRefreshing})



        UserInfoStore.getUserToken().then(
            (tocken) => {
                //有用户信息
                if (tocken) {
                    apis.loadInvoiceTitleListInfo(tocken).then(
                        (responseData) => {

                            if(responseData.code === 0){
                                let newList = responseData.list;


                                let exampleList = [
                                    {
                                        '_id': '0',
                                        'company': 'fjdklajflkajfklajflakdjffakdfjalkdjfakldjfkladjflkadjfkaljfakldfjakljfkajdffd',
                                        'taxID': '9113232058302930294462',
                                        'address': '北京北京市朝阳区小清路25号1101',
                                        'mobile': '13188888888',
                                        'bank': '建设银行',
                                        'account': '100000010000001000'
                                    },
                                    {
                                        '_id': '1',
                                        'company': '北京爱康鼎科技有限公司',
                                        'taxID': '9113232058302930294463',
                                        'address': '北京北京市朝阳区小清路25号1102',
                                        'mobile': '13188888888',
                                        'bank': '建设银行',
                                        'account': '100000010000001001'
                                    },
                                ];




                                let dataList = newList;
                                this.setState({
                                    dataList: dataList,
                                    refreshState:RefreshState.NoMoreData,
                                });

                                if (this.state.dataList.length === 0){

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
            },

        );








    }

    _reloadPage(){
        this._isLogined();

    }


    _readed(item){

        pushJump(this.props.navigator, item.url,item.title?item.title:'噼里啪智能财税',item.title?item.title:'噼里啪智能财税',item.content);

    }


    _pushToAddInvoiceTitlePage(){
        this.push({
            screen: 'AddInvoiceTitlePage',
            title:'编辑',
            passProps: {
                //回调!
                callback: this.loadData,
            }
        });




    }


    onHeaderRefresh = () => {
        this.page=1;

        this.loadData()
    };


    renderCell = (info) => {
        return(
            <TouchableOpacity onPress={this._readed.bind(this,info.item)}>
                <InvoiceTitleCell
                    invoiceTitle={info.item.company}
                    invoiceSubTitle={info.item.taxID}

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
                        onHeaderRefresh={this.onHeaderRefresh}
                        contentContainerStyle={{paddingTop:10,backgroundColor:'#f1f1f1'}}

                    />
                    <SubmitButton onPress={this._pushToAddInvoiceTitlePage.bind(this)}
                                  isEnabled={true}

                                  text="添加发票抬头"
                    />
                </View>
            )
        }else {
            return(


                <View style={styles.container}>
                    <DefaultView onPress={()=>this._reloadPage()} type ={this.state.initStatus}/>
                    <SubmitButton onPress={this._pushToAddInvoiceTitlePage.bind(this)}
                                  isEnabled={true}

                                  text="添加发票抬头"
                    />

                </View>


            )
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Platform.OS == 'ios' ? 20 : 0,
        backgroundColor:'#f1f1f1'
    },
    title: {
        fontSize: 18,
        height: 84,
        textAlign: 'center'
    }
});
