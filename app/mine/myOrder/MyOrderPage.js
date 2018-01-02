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
    DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native';
import PLPCustomNavBar from '../../view/PLPCustomNavBar'
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
            loadState:'success',
            title:'我的订单',
            isCompanies:false
        };
        this.loadData=this.loadData.bind(this);
        this.initData=this.initData.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true,
    };

    componentDidMount() {
        this.initData()
        this.refreshEmitter = DeviceEventEmitter.addListener('ChangeCompany', () => {
            this.initData()
        });
    }
    _leftItem(){
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigator.pop()}>
                <View style={{width:50,height:44, justifyContent:'center'}}>
                    <Image style={{marginLeft:10}} source={require('../../img/left.png')} />
                </View>
            </TouchableWithoutFeedback>

        )
    }
    _rightItem(){
        return (
            <View style={{width:50,height:44}} />
        )
    }
    _titleItem(){

        if(this.state.isCompanies){
            return (
                <TouchableOpacity onPress ={()=>this.props.navigator.showLightBox({
                    screen: "ChangeCompanyLightBox",
                    passProps: {
                        onClose: this.dismissLightBox,
                    },
                    style: {
                        backgroundBlur: 'none',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        tapBackgroundToDismiss:true
                    }
                })}>
                    <View style={{width:DeviceInfo.width*0.6,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text numberOfLines={1} style={{fontSize:setSpText(18),fontWeight:'bold',textAlign:'center'}}>{this.state.title.length>10?this.state.title.substr(0,10)+'...':this.state.title}&#12288;</Text>
                        <Image source={require('../../img/change_arrow.png')}/>
                    </View>

                </TouchableOpacity>
            )
        }else{
            return (
                <Text style={{fontSize:setSpText(18),fontWeight:'bold'}}>{this.state.title}</Text>
            )
        }
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

                    //判断是否是多加公司
                    UserInfoStore.getCompanyArr().then(
                        (companyArr) => {
                            if(companyArr && companyArr.length>1){
                                //多家
                                if (company && company.infos && company.infos[0] && company.infos[0].value) {

                                    this.initNavigationBar(true,company.infos[0].value)

                                }else{
                                    this.initNavigationBar(true)
                                }
                            }else{
                                //一家或者没有
                                this.initNavigationBar(false)
                            }
                        },
                        (e) => {
                            //一家或者没有
                            this.initNavigationBar(false)

                        },
                    );

                }else{
                    this.companyid = undefined
                    this.companytype=undefined
                    this.initNavigationBar(false)

                }
                this.loadData()

            },
            (e) => {
                this.loadData()
                console.log(e)
                this.initNavigationBar(false)

            },
        );
    }
    initNavigationBar(isCompanies=false,title='我的订单'){

        this.setState({
            title:title,
            isCompanies:isCompanies
        })
    }
    loadData(){
        //测试用
        // this.companyid='285729'
        // this.companytype=1

        if(this.companyid!=null&&this.companyid!=undefined) {
            var loading = SActivityIndicator.show(true, "加载中...");
            apis.loadOrderListData(this.companyid,this.companytype).then(
                (responseData) => {
                    SActivityIndicator.hide(loading);
                    if (responseData.code == 0) {
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
                                    data: [],
                                    doing: [],
                                    hang: [],
                                    done: [],
                                    loadState: 'success'
                                }
                            );
                        }


                    }else{
                        this.setState({
                                loadState: 'error'
                            }
                        );
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
                    data: [],
                    doing: [],
                    hang: [],
                    done: [],
                    loadState: 'success'
                }
            );
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
                <View style={{flex:1}}>
                    <PLPCustomNavBar leftItem={this._leftItem.bind(this)} rightItem={this._rightItem.bind(this)} titleItem={this._titleItem.bind(this)} />
                    <ScrollableTabView
                        renderTabBar={() => <CustomTabBar/>}
                        style={styles.container}
                        tabBarUnderlineStyle={styles.lineStyle}//选中时线的样式
                        tabBarActiveTextColor='#C6A567'//选中时字体的颜色
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
                </View>

            )
        }else{
            return(
                <View style={{flex:1}}>
                    <PLPCustomNavBar leftItem={this._leftItem.bind(this)} rightItem={this._rightItem.bind(this)} titleItem={this._titleItem.bind(this)} />
                    <DefaultView onPress={()=>this.loadData()} type ={this.state.loadState}/>

                </View>
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