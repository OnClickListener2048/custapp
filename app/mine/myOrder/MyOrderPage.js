/**
 * Created by liufei on 2017/9/19.
 */
import React, {Component} from 'react';
const dismissKeyboard = require('dismissKeyboard');
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CustomTabBar from './view/CustomTabBar'
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter
} from 'react-native';

import  MyOrderStatePage from './MyOrderStatePage'
import BComponent from '../../base/BComponent'
import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
export default class MyOrderPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:[],//全部
            doing:[],//进行中
            hang:[],//已驳回
            done:[],//已结束
            loadState:'success'
        };
        this.loadData=this.loadData.bind(this);
        this.initData=this.initData.bind(this);
    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event);
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses

            if (event.id == 'ChangeCompany') {
                this.props.navigator.showLightBox({
                    screen: "ChangeCompanyLightBox",
                    passProps: {
                        onClose: this.dismissLightBox,
                    },
                    style: {
                        backgroundBlur: 'none',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        tapBackgroundToDismiss:true
                    }
                });
            }
        }
    }
    componentDidMount() {
        this.initNavigatorBar();
        this.initData()
        this.refreshEmitter = DeviceEventEmitter.addListener('ChangeCompany', () => {
            this.initData()
        });
    }
    initNavigatorBar(){
        UserInfoStore.getCompanyArr().then(
            (companyArr) => {
                if(companyArr && companyArr.length>1){
                    //多家
                    this.props.navigator.setButtons({
                        rightButtons: [{
                            icon: require('../../img/change.png'), // for icon button, provide the local image asset name
                            id: 'ChangeCompany', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            disableIconTint:true
                        }], // see "Adding buttons to the navigator" below for format (optional)
                    });
                }else{
                    //一家或者没有
                    this.props.navigator.setButtons({
                        rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
                    });
                }
            },
            (e) => {
                //一家或者没有
                this.props.navigator.setButtons({
                    rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
                });
            },
        );
    }
    componentWillUnmount() {
        this.refreshEmitter.remove();
    }

    initData(){
        UserInfoStore.getCompany().then(
            (company) => {
                console.log('company', company);
                if (company && company.id&&company.type) {
                    this.companyid = company.id
                    this.companytype=company.type
                }else{
                    this.companyid = undefined
                    this.companytype=undefined
                }
                this.loadData()

            },
            (e) => {
                this.loadData()
                console.log(e)
            },
        );
    }

    loadData(){
        //测试用
        // this.companyid='99999'
        // this.companytype=1

        if(this.companyid!=null&&this.companyid!=undefined) {
            var loading = SActivityIndicator.show(true, "加载中...");
            apis.loadOrderListData(this.companyid,this.companytype).then(
                (responseData) => {
                    if (responseData.code == 0) {
                        SActivityIndicator.hide(loading);
                        var data = responseData.list;
                        if (data != null && data != []) {
                            var hang = [];
                            var done = [];
                            var doing = [];
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].status == 9) {
                                    hang.push(data[i]);
                                } else if (data[i].status == 6||data[i].status == 5) {
                                    done.push(data[i]);
                                } else {
                                    doing.push(data[i])
                                }
                            }
                            this.setState({
                                    data: data,
                                    doing: doing,
                                    hang: hang,
                                    done: done,
                                    loadState: 'success'
                                }
                            );
                        } else {
                            this.setState({
                                    loadState: 'no-data'
                                }
                            );
                        }


                    }
                },
                (e) => {
                    SActivityIndicator.hide(loading);
                    this.setState({
                        loadState: NetInfoSingleton.isConnected ? 'error' : 'no-net',
                    })
                    console.log('error', e)

                },
            );
        }else{
            this.setState({
                loadState: 'no-data',
            })
        }
    }


    _lockSlide(){
        if (Platform.OS === 'android') {
            this.scrollTabView.setNativeProps(false);
        }
    }

    _openSlide(){
        if (Platform.OS === 'android'){
            this.scrollTabView.setNativeProps(true);
        }
    }


    render(){
        if(this.state.loadState == 'success') {
            return (
                <ScrollableTabView
                    renderTabBar={() => <CustomTabBar/>}
                    style={styles.container}
                    tabBarUnderlineStyle={styles.lineStyle}//选中时线的样式
                    tabBarActiveTextColor='#E13238'//选中时字体的颜色
                    tabBarBackgroundColor='#ececec'//整个tab的背景色
                    tabBarInactiveTextColor='#999999'//未选中时字的颜色
                    tabBarTextStyle={styles.textStyle}//tab字体的样式
                    ref={(scrollTabView) => {
                        this.scrollTabView = scrollTabView;
                    }}
                >
                    <MyOrderStatePage tabLabel='进行中'
                                      sourceData={this.state.doing}
                                      lockSlide={this._lockSlide.bind(this)} //解决ScrollableTabView和listView的滑动冲突
                                      openSlide={this._openSlide.bind(this)}
                                      {...this.props}//把所有属性都传给子页面

                    />
                    <MyOrderStatePage tabLabel='已驳回'
                                      sourceData={this.state.hang}
                                      lockSlide={this._lockSlide.bind(this)}
                                      openSlide={this._openSlide.bind(this)}
                                      {...this.props}
                    />
                    <MyOrderStatePage tabLabel='已结束'
                                      sourceData={this.state.done}
                                      lockSlide={this._lockSlide.bind(this)}
                                      openSlide={this._openSlide.bind(this)}
                                      {...this.props}
                    />
                    <MyOrderStatePage tabLabel='全部'
                                      sourceData={this.state.data}
                                      lockSlide={this._lockSlide.bind(this)}
                                      openSlide={this._openSlide.bind(this)}
                                      {...this.props}
                    />
                </ScrollableTabView>
            )
        }else{
            return(
                <DefaultView onPress={()=>this.loadData()} type ={this.state.loadState}/>
            )
        };
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f9f9f9',
        paddingTop:10

    },

    lineStyle: {
        // height: 1,
        backgroundColor: '#E13238',
    },

    textStyle:{
        fontSize:16,
        marginTop:10
    }

});