

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
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

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
            isLoading:true,
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
        };
        this.page =1;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        // this._CallBackRefresh = this._CallBackRefresh.bind(this);

    }


    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event)
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'AddInvoiceTitle') { // this is the same id field from the static navigatorButtons definition
                this.push({
                    screen: 'AddInvoiceTitlePage',
                    title:'添加',
                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    passProps: {
                        //回调!
                        // callback: this._CallBackRefresh,
                        backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    }
                });
            }
        }
    }



    componentDidMount() {
        this.props.navigator.setButtons({
            rightButtons: [{icon: require('../../img/addInvoiceTitle.png'),id:'AddInvoiceTitle'}], // see "Adding buttons to the navigator" below for format (optional)
        });

        //打开即可
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            })
        }else{
            this._isLogined();
        }

        this.refreshEmitter = DeviceEventEmitter.addListener('ReloadInvoiceTitleState', () => {
            this.loadData()
        });
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

    componentWillUnmount() {
        this.refreshEmitter.remove();
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
        this.setState({refreshState: RefreshState.HeaderRefreshing});

        let loading;
        if (this.state.isLoading === true){
            loading = SActivityIndicator.show(true, "载入中...");
        }

        UserInfoStore.getUserInfo().then(
            (user) => {
                if(user){
                    apis.loadInvoiceTitleListInfo(user.username).then(
                        (responseData) => {

                            if (this.state.isLoading === true){
                                SActivityIndicator.hide(loading);
                                this.setState({
                                    isLoading: false,
                                });
                            }

                            if(responseData.code === 0){
                                let newList = responseData.list;
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
                            if (this.state.isLoading === true){
                                SActivityIndicator.hide(loading);
                                this.setState({
                                    isLoading: false,
                                });
                            }
                            this.setState({refreshState: RefreshState.Failure})
                        },
                    );
                }
            },

        );

    }

    _reloadPage(){
        this.setState({
            isLoading:true
        });
        this._isLogined();
    }


    _clickCell(item){
        this.push({
            screen: 'CheckInvoiceTitlePage',
            title:'我的抬头',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps: {
                //回调!
                // callback: this._CallBackRefresh,
                id: item._id,
            }
        });
    }



    onHeaderRefresh = () => {
        this.page=1;
        this.loadData()
    };


    renderCell = (info) => {
        return(
            <TouchableOpacity onPress={this._clickCell.bind(this,info.item)}>
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
                </View>
            )
        }else {
            return(
                <DefaultView onPress={()=>this._reloadPage()} type ={this.state.initStatus}/>
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
