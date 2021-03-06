/**
 * Created by liufei on 2017/9/15.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    ScrollView,
    Linking,
    DeviceEventEmitter
} from 'react-native';
export let H5_URL = 'https://www.pilipa.cn/'
import pushJump from '../../util/pushJump';
import DeviceInfo from 'react-native-device-info';
import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import CommenCell from '../../view/CommenCell'
import BComponent from '../../base';
import Toast from 'react-native-root-toast';
import {isIphoneX} from '../../util/iphoneX-helper'

import * as apis from '../../apis';
import Alert from "react-native-alert";

export default class MinePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            phone: '注册/登录', //手机号
            avatar: require('../../img/head_img.png'),// 头像
            company: '请立即注册或登录',//公司名称
            logined: false,// 是否已登陆
            updateIcon:false,//红色提示（New）是否显示，及首页更新弹窗是否显示
            upgrade:false,//是否有新版本
            loadState:'success',
            newVersion:'',//最新APP版本号
            isforce:false,//是否强制更新
            apkUrl:'',//新包地址
            desc:[],//版本说明
            loginCSwitch:true,//默认开关关闭
            settingNew:true,//默认显示版本更新的new
            orderCount:'',
            companyCount:'',
            invoiceCount:''
        };

        this.initPage = this.initPage.bind(this);
        this.reset = this.reset.bind(this);
        this._updateOpenOrClose = this._updateOpenOrClose.bind(this);
        this._uploadUpdateCode = this._uploadUpdateCode.bind(this);

    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    // 子类请继承此方法, 不要忘了调用super.onNavigatorEvent(event);
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        console.log('MinePage', event.id);//willAppear
        super.onNavigatorEvent(event);
        if (event.id === 'willAppear') {
            NavigatorSelected = this.props.navigator;
            this.refreshCount()
        }
    }

    componentDidMount() {
        this.initPage()
        this.refreshEmitter = DeviceEventEmitter.addListener('ChangeCompany', () => {
            this.initPage()
        });
    }

    componentWillUnmount() {
        this.refreshEmitter.remove();
    }
    refreshCount(){
        UserInfoStore.isLogined().then(
            logined => {
                //设置登录状态
                this.setState({logined:logined});
                if(!logined) {
                    //未登录展示
                    this.reset();
                }else{
                    //获取订单 抬头  公司总数
                    apis.loadMinePageNumber().then((responseData) =>{
                        if(responseData.code == 0){
                            this.setState({
                                orderCount:responseData.data.orderCount,
                                companyCount:responseData.data.companyCount,
                                invoiceCount:responseData.data.titleCount
                            })
                        }else{
                            this.setState({
                                orderCount:'',
                                companyCount:'',
                                invoiceCount:''
                            })
                        }
                    },(e)=>{
                        this.setState({
                            orderCount:'',
                            companyCount:'',
                            invoiceCount:''
                        })
                    })

                }
            },(e)=>{
                this.reset();

            }
        )
    }
    initPage(){
        UserInfoStore.isLogined().then(
            logined => {
                //设置登录状态
                this.setState({logined:logined});
                if(!logined) {
                    //未登录展示
                    this.reset();
                }else{
                    
                    //已登录获取用户信息
                    UserInfoStore.getUserInfo().then(
                        (user) => {
                            if (user) {
                                //获取成功设置头像电话号码
                                this.setState({userName: user.name, phone: user.mobilePhone});
                                if(user.avatar !== null) {
                                    this.setState({avatar: {uri:user.avatar}});
                                }
                                //获取当前公司
                                UserInfoStore.getCompany().then(
                                    (company) => {
                                        console.log('company', company);
                                        //获取成功 设置公司名称
                                        if (company && company.infos && company.infos[0] && company.infos[0].value) {
                                            this.setState({company: company.infos[0].value});
                                        } else {
                                            this.setState({company: ''});
                                        }

                                    },
                                    (e) => {
                                        console.log("读取信息错误:", e);
                                    },
                                );

                            } else{
                                this.reset();
                            }
                        },
                        (e) => {
                            this.reset();
                            console.log("读取信息错误:", e);
                        },
                    );
                }
            },(e)=>{
                this.reset();

            }
        )

    }


    reset() {
        this.setState({
            phone: '注册/登录', //手机号
            avatar: require('../../img/head_img.png'),// 头像
            company: '请立即注册或登录',//公司名称
            logined: false,// 是否已登陆
            orderCount:'',//订单总数
            companyCount:'',//公司总数
            invoiceCount:''
        });
    }

    // 准备加载组件
    componentWillMount() {

        UserInfoStore.getUpgrade_setting().then(
            (info) => {
                if (info !== null) {
                    this.setState({
                        settingNew:info.upgrade
                    })
                }})
        this._loginSwitch();
    }

    _loginSwitch(){
        apis.mobilelogin().then(
            v => {
                console.log(v);
                console.log("开关="+v.open);
                // v.open = !v.open;  true为手机号登录，FALSE 为微信登录
                this.setState({loginCSwitch: v.open});
                //iOS不显示版本更新信息
                //获取本APP版本信息
                this._uploadUpdateCode(DeviceInfo.getVersion());
            }, e => {
                this._uploadUpdateCode(DeviceInfo.getVersion());
                console.log(e);
            }
        );

    }

    //版本更新
    _uploadUpdateCode(versionCode){
        apis.loadupdateCode(versionCode).then(
            (responseData) => {
                if (responseData.code == 0) {
                    console.log("版本更新信息="+responseData.info.upgrade+this.state.loginCSwitch);
                    // responseData.info.version = '1.0.6';
                    // responseData.info.url = 'http://pilipa-assets.oss-cn-beijing.aliyuncs.com/app/li-armeabi-v7a-release_pilipa.apk';
                    // responseData.info.isforce = true;
                    // responseData.info.desc = ["更新说明"];
                    // responseData.info.upgrade = true;

                    this.setState({
                        upgrade:responseData.info.upgrade?responseData.info.upgrade:false,
                        updateIcon:responseData.info.upgrade?responseData.info.upgrade:false,
                        // updateIcon:true,
                        newVersion:responseData.info.version?responseData.info.version:DeviceInfo.getVersion(),
                        // newVersion:"1.0.6",
                        isforce:responseData.info.isforce?responseData.info.isforce:false,
                        apkUrl:responseData.info.url?responseData.info.url:'',
                        desc:responseData.info.desc?responseData.info.desc:[],
                            loadState: 'success'
                        }
                    );

                    UserInfoStore.getUpgrade_alert().then(
                        (info) => {
                            if (info !== null) {
                                console.log('getUpgrade_alert', info+","+info.upgrade,info.newversion);

                                //如果有多级版本更新则更新存储信息  或  强制更新则再次显示弹窗
                                if(info.newversion !== this.state.newVersion||this.state.isforce){
                                    // UserInfoStore.removeUpgrade_alert().then();
                                    // UserInfoStore.removeUpgrade_setting().then();
                                    let  upgradeAlert = {
                                        'upgrade':this.state.updateIcon,
                                        'newversion':this.state.newVersion,
                                    }
                                    UserInfoStore.setUpgrade_alert(upgradeAlert).then();
                                    UserInfoStore.setUpgrade_setting(upgradeAlert).then();
                                    this.setState({
                                        settingNew:this.state.updateIcon
                                    })
                                }else{
                                if(Platform.OS === 'ios'&&this.state.loginCSwitch||
                                    info.upgrade === false){
                                        return;
                                }}
                            }else{
                                console.log("何时执行"+this.state.apkUrl+","+this.state.updateIcon);
                                //如果无新版本，不在调用更新提示框
                                if(Platform.OS === 'ios'&&this.state.loginCSwitch||this.state.updateIcon === false){
                                    return;
                                }
                            }
                            if(this.state.upgrade||this.state.isforce){
                                console.log("唤起弹窗"+this.state.apkUrl+","+this.state.updateIcon,this.state.upgrade);
                                //调用更新提示框
                                this.props.navigator.showLightBox({
                                    screen: "UpdateLightBox",
                                    passProps: {
                                        onClose: this.dismissLightBox,
                                        // dataArr:['1.版本更新版本更新版本更新版本更新版本更新版本更新版本更新','2.dfjsifjksdafjas','3.fdaskfjadskfjsdkf'],
                                        dataArr:this.state.desc,
                                        version:this.state.newVersion,
                                        apkUrl:this.state.apkUrl,
                                        isForce:this.state.isforce,
                                    },
                                    overrideBackPress: true, // 拦截返回键
                                    style: {
                                        backgroundBlur: 'none',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        tapBackgroundToDismiss:true
                                    }
                                })
                            }

                        },
                        (e) => {
                            console.log("读取信息错误:", e);
                        },
                    );

                }else{
                    this.setState({
                            loadState: 'error'
                        }
                    );
                }
            },
            (e) => {
                this.setState({
                    loadState: NetInfoSingleton.isConnected ? 'error' : 'no-net',
                })
                console.log('error', e)

            },
        );

    }

    render(){
        console.log("new是否显示的settingNew="+this.state.settingNew+this.state.upgrade);
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F1F1F1'}}>
                        <Image style={styles.login_wrapper} source={require('../../img/Rectangle.png')}>
                            <TouchableOpacity
                                accessibilityLabel="mine_PersonalDataPage" testID="mine_PersonalDataPage"
                                onPress={this.login.bind(this)}>

                        <View style={{flexDirection:'row'}}>
                            <Image style={styles.head_img} source={this.state.avatar}/>
                            <View style={styles.login_title_wrapper}>
                                <Text style={[styles.login,{marginTop:this.state.company.length > 0 ? 0: 10}]}>
                                    {this.state.phone || this.state.userName}
                                </Text>
                                <Text numberOfLines={1} style={[styles.company,{marginTop:2}]}>
                                    {this.state.company}
                                </Text>
                            </View>
                            <Image style={styles.left_bu} source={require('../../img/right_white_btn.png')}/>

                        </View>
                            </TouchableOpacity>

                        </Image>


                    <CommenCell
                        accessibilityLabel="mine_MyCompany" testID="mine_MyCompany"
                        leftIcon={require('../../img/myCorp.png')}
                        leftText="公司与授权"
                        onPress = {this._goto.bind(this,'ChangeCompanyPage','我的公司')}
                        rightText={this.state.companyCount}
                        style={{marginTop:9}}
                    />
                    <CommenCell
                        accessibilityLabel="mine_MyOrders" testID="mine_MyOrders"
                        leftIcon={require('../../img/orders.png')}
                        leftText="我的订单"
                        onPress = {this._goto.bind(this,'MyOrderPage','我的订单')}
                        rightText={this.state.orderCount}

                    />

                    <CommenCell
                        accessibilityLabel="mine_myInvoice" testID="mine_myInvoice"
                        leftIcon={require('../../img/myInvoice.png')}
                        leftText="我的抬头"
                        onPress = {this._goto.bind(this,'InvoiceTitleListPage','公司抬头')}
                        rightText={this.state.invoiceCount}
                        style={{marginBottom:9}}
                        underLine={false}

                    />

                    {/*<CommenCell*/}
                        {/*leftText="消息"*/}
                        {/*onPress = {this._goto.bind(this,'MessagePage','消息')}*/}
                    {/*/>*/}

                    <CommenCell
                        accessibilityLabel="mine_customerService" testID="mine_customerService"
                        leftIcon={require('../../img/customerService.png')}
                        leftText="联系客服"
                        // style={{marginTop:9}}
                        onPress = {this._call.bind(this,'')}
                    />

                    <CommenCell
                        accessibilityLabel="mine_bizPartner" testID="mine_bizPartner"
                        leftIcon={require('../../img/bizPartner.png')}
                        leftText="加盟合作"
                        onPress={this._goColumnDetail.bind(this)}
                        underLine={false}
                        style={{marginBottom:9}}
                    />

                    {Platform.OS === 'ios'||(this.state.updateIcon===false||!this.state.settingNew)||!this.state.upgrade?
                        <CommenCell
                            leftIcon={require('../../img/settings.png')}
                            leftText="设置"

                            underLine={false}
                            onPress = {this._goto.bind(this,'SettingPage','设置')}

                        />:
                        <CommenCell
                            accessibilityLabel="mine_settings" testID="mine_settings"
                            leftIcon={require('../../img/settings.png')}
                            leftText="设置"
                            underLine={false}
                            leftTextIcon={require('../../img/new_icon.png')}
                            onPress = {this._goto.bind(this,'SettingPage','设置')}

                        />}

                    {/*<CommenCell*/}
                        {/*leftText="查看日志"*/}
                        {/*style={{marginTop: 10}}*/}
                        {/*onPress={ () => {*/}
                            {/*this.push({*/}
                                {/*screen: 'LogViewer',*/}
                                {/*title:'查看日志',*/}
                            {/*});*/}
                        {/*}}*/}
                    {/*/>*/}
                </ScrollView>
            </View>

        )
    }

    _goColumnDetail(){
        UMTool.onEvent('leagueCooperation')
        pushJump(this.props.navigator, H5_URL+'invest','加盟合作','噼里啪智能财税','加盟合作');
    }

    _call(){
        Linking.openURL('tel:400-107-0110')
    }


    _goto(screen, title ){
        if(screen === '')return;

        //未登录不能跳转的页面
        if(!this.state.logined) {
            //screen ==='MessagePage'||   ||screen === 'CompanySurveyPage' 企业信息跳转
            if(screen === 'BindPhonePage' ||screen === 'CompanySurveyPage'||screen === 'MyOrderPage' || screen === 'AccountAndSecurity') {
                Toast.show("请先登录")
                return;
            }
        }

        if(screen == 'ChangeCompanyPage'){

            UserInfoStore.getCompanyArr().then(
                (companyArr) => {
                    console.log('companyArr-----',companyArr)
                    // if(companyArr && companyArr.length >= 1){
                        //多家
                        this.push({
                            screen: screen,
                            title:title,
                            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                        });



                },
                (e) => {
                    //一家或者没有
                    this.push({
                        screen: 'CompanySurveyPage',
                        title:title,
                        backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                    });

                },
            );

        }else if(screen == 'SettingPage'){

                        this.push({
                            screen: screen,
                            title:title,
                            passProps: {
                                updateIcon:this.state.upgrade,
                                //回调!
                                callback: this._updateOpenOrClose,
                                backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                            }
                        });


        }else{
            this.push({
                screen: screen,
                title:title,
                backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            });
        }

    }

    _updateOpenOrClose(updateIcon){

        if(updateIcon!=null){
            console.log("返回是否点击过更新按钮="+updateIcon);
            this.setState({updateIcon: updateIcon,});
            let  upgradeAlert = {
                'upgrade':updateIcon,
                'newversion':this.state.newVersion,
            }
            UserInfoStore.setUpgrade_setting(upgradeAlert).then();

        }

    }

    changeCallBack=()=>{
        this.push({
            screen: 'CompanySurveyPage',
            title:'企业概况'
        });
    }
    login(){
        if(this.state.logined) {
            this.push({
                screen: 'PersonalDataPage',
                title:'个人资料',
            });
        } else {
            loginJumpSingleton.goToLogin(this.props.navigator);
        }
    }

}

const styles = StyleSheet.create({
    login_wrapper:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        paddingHorizontal:20,
        height:157/375*SCREEN_WIDTH,
        paddingBottom:20,
        paddingTop:157/375*SCREEN_WIDTH - 90,

        backgroundColor:'transparent',
        marginTop:Platform.OS === 'ios' ?isIphoneX()?-35: -20 : 0,
        justifyContent:'space-between'
    },

    head_img:{
        width:60,
        height:60,
        borderRadius: 30,
    },
    login_title_wrapper:{
        width:SCREEN_WIDTH-30-70-22,
        marginTop:11,
        marginLeft:10
    },
    login:{
        fontSize:18,
        color:'#FFFFFF',
    },
    company:{
        fontSize:14,
        color:'#FFFFFF'
    },
    left_bu:{
        resizeMode: "contain",
        marginTop:20,
        marginLeft:10
    },
    items:{
        flexDirection:'row',
        width:SCREEN_WIDTH,
        paddingHorizontal:20,
        backgroundColor:'#FFFFFF',
        marginTop:10,
        paddingVertical:20,
        alignItems:'center',
        justifyContent:'space-between'
    },
    items_text:{
        fontSize:16,
        color:'#333333',

    },
    items_button:{
        resizeMode: "contain",
    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#ececec',
        borderBottomWidth:0.5 ,
        backgroundColor:'transparent'
    },

});