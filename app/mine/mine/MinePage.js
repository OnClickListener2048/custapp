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
import DeviceInfo from 'react-native-device-info';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import CommenCell from '../../view/CommenCell'
import BComponent from '../../base';
import Alert from "react-native-alert";
import Toast from 'react-native-root-toast';
import * as apis from '../../apis/setting';

export default class MinePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            phone: '注册/登录', //手机号
            avatar: require('../../img/head_img.png'),// 头像
            company: '请立即注册或登录',//公司名称
            logined: false,// 是否已登陆
            updateIcon:false,
            loadState:'success',
            newVersion:'',//最新APP版本号
            isforce:false,//是否强制更新
            apkUrl:'',//新包地址
            desc:[],//版本说明
            loginSwitch:false,//默认开关关闭
        };

        this.initPage = this.initPage.bind(this);
        this.reset = this.reset.bind(this);
        this._updateOpenOrClose = this._updateOpenOrClose.bind(this);

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
            this.initPage();
            this.checkCompany()
        }
    }
    //查公司接口超级慢 页面每次进入 调一次
    checkCompany(){
        //获取手机号
        UserInfoStore.getUserInfo().then(
            (user) => {
                if (user && user.mobilePhone) {
                    //获取公司
                    apis.getCompany(user.mobilePhone).then(
                        (companyInfo) => {
                            if (companyInfo) {

                                let tmpCompaniesArr = companyInfo.list;


                                UserInfoStore.getCompanyArr().then(
                                    (companyArr) => {
                                        if (JSON.stringify(tmpCompaniesArr) != JSON.stringify(companyArr)) {

                                            if(tmpCompaniesArr && tmpCompaniesArr.length>0){
                                                //有公司
                                                UserInfoStore.setCompanyArr(tmpCompaniesArr).then(
                                                    (s) => {
                                                        console.log("公司信息保存成功");
                                                    },
                                                    (e) => {
                                                        console.log("公司信息保存错误:", e);
                                                    },
                                                );

                                                UserInfoStore.setCompany(tmpCompaniesArr[0]).then(
                                                    (s) => {
                                                        console.log("公司信息保存成功");
                                                        this.setState({company: tmpCompaniesArr[0].infos[0].value});
                                                        DeviceEventEmitter.emit('ChangeCompany');

                                                    },
                                                    (e) => {
                                                        console.log("公司信息保存错误:", e);
                                                    },
                                                );
                                            }else{
                                                //没公司
                                                UserInfoStore.removeCompany().then((s)=>{
                                                    this.setState({company: ''});
                                                    DeviceEventEmitter.emit('ChangeCompany');
                                                },(e)=>{

                                                });
                                                UserInfoStore.removeCompanyArr().then();
                                            }


                                        }
                                    },
                                    (e) => {

                                    },
                                );
                            }
                        },
                        (e) => {

                        },
                    );
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

    }
    reset() {
        this.setState({
            phone: '注册/登录', //手机号
            avatar: require('../../img/head_img.png'),// 头像
            company: '请立即注册或登录',//公司名称
            logined: false,// 是否已登陆
        });
    }

    // 准备加载组件
    componentWillMount() {
        //iOS不显示版本更新信息
        // if(Platform.OS!=='ios'){
            //获取本APP版本信息
            DeviceInfo.getVersion();
            this._uploadUpdateCode('1.0.6');
        // }
        this.initPage();
        this.subscription = DeviceEventEmitter.addListener('goLoginPage', (data)=>{
            console.log('goLoginPage loginJumpSingleton.isJumpingLogin=', loginJumpSingleton.isJumpingLogin);
            loginJumpSingleton.goToLogin(this.props.navigator);
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    //版本更新
    _uploadUpdateCode(versionCode){
        apis.loadupdateCode(versionCode).then(
            (responseData) => {
                if (responseData.code == 0) {
                    console.log("版本更新信息="+responseData.info.upgrade);
                    this.setState({
                        updateIcon:responseData.info.upgrade?responseData.info.upgrade:false,
                        // updateIcon:true,
                        newVersion:responseData.info.version?responseData.info.version:DeviceInfo.getVersion(),
                        isforce:responseData.info.isforce?responseData.info.isforce:false,
                        apkUrl:responseData.info.url?responseData.info.url:'',
                        desc:responseData.info.desc?responseData.info.desc:[],
                            loadState: 'success'
                        }
                    );

                    console.log("何时执行"+this.state.apkUrl);

                    //如果无新版本，不在调用更新提示框
                    if(Platform.OS === 'ios'&&!this.state.loginSwitch||this.state.updateIcon === false){
                        return;
                    }//调用更新提示框
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
                        style: {
                            backgroundBlur: 'none',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            tapBackgroundToDismiss:true
                        }
                    })

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

    initPage() {
        console.log('MinePage', 'initPage');
        UserInfoStore.isLogined().then(
            logined => {
                    console.log('MinePage logined', logined);
                    this.setState({logined:logined});
                    if(!logined) {
                        this.reset();
                    } else {
                        UserInfoStore.getUserInfo().then(
                            (user) => {
                                if (user !== null) {
                                    this.setState({userName: user.name, phone: user.mobilePhone});

                                    if(user.avatar !== null) {
                                        console.log('MinePage', user.avatar);
                                        this.setState({avatar: {uri:user.avatar}});
                                    }
                                } else {
                                    this.reset();
                                }
                            },
                            (e) => {
                                console.log("读取信息错误:", e);
                                this.reset();
                            },
                        );

                        UserInfoStore.getCompany().then(
                            (company) => {
                                console.log('company', company);
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
                    }
                },
            e => {
                console.log("读取登陆状态错误:", e);
                this.reset();
            }
        );
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9',position:'relative'}}>
                <View style={{width:DeviceInfo.width,height:DeviceInfo.height/3,backgroundColor:'white',position:'absolute'}}/>
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#F9F9F9'}}>
                    <TouchableOpacity style={styles.login_wrapper} onPress={this.login.bind(this)}>
                        <View style={{flexDirection:'row'}}>
                            <Image style={styles.head_img} source={this.state.avatar}/>
                            <View style={styles.login_title_wrapper}>
                                <Text style={styles.login}>
                                    {this.state.phone || this.state.userName}
                                </Text>
                                <Text style={styles.company}>
                                    {this.state.company}
                                </Text>
                            </View>
                        </View>
                        <Image style={styles.left_bu} source={require('../../img/left_button.png')}/>
                    </TouchableOpacity>
                    <CommenCell
                        leftText="我的订单"
                        style={{marginTop:9}}
                        onPress = {this._goto.bind(this,'MyOrderPage','我的订单')}
                    />
                    <CommenCell
                        leftText="企业信息"
                        onPress = {this._goto.bind(this,'CompanySurveyPage','企业概况')}
                    />
                    {/*<CommenCell*/}
                        {/*leftText="消息"*/}
                        {/*onPress = {this._goto.bind(this,'MessagePage','消息')}*/}
                    {/*/>*/}
                    <CommenCell
                        leftText="账号与安全"
                        onPress = {this._goto.bind(this,'AccountAndSecurity','账号与安全')}
                        style={{marginTop:9}}
                    />
                    {Platform.OS === 'ios'||this.state.updateIcon===false?
                        <CommenCell
                        leftText="设置"
                        onPress = {this._goto.bind(this,'SettingPage','设置')}
                    />:
                        <CommenCell
                            leftText="设置"
                            leftTextIcon={require('../../img/new_icon.png')}
                            onPress = {this._goto.bind(this,'SettingPage','设置')}
                        />}

                    <CommenCell
                        leftText="联系客服"
                        style={{marginTop:9}}
                        onPress = {this._call.bind(this,'')}
                    />

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
    _call(){
        Linking.openURL('tel:400-107-0110')
    }
    _goto(screen, title ){
        if(screen === '')return;

        //未登录不能跳转的页面
        if(!this.state.logined) {
            //screen ==='MessagePage'||
            if(screen === 'BindPhonePage' ||screen === 'MyOrderPage' ||screen === 'CompanySurveyPage' || screen === 'AccountAndSecurity') {
                Toast.show("请先登录")
                return;
            }
        }

        if(screen == 'CompanySurveyPage'){

            UserInfoStore.getCompanyArr().then(
                (companyArr) => {
                    console.log('companyArr-----',companyArr)
                    if(companyArr && companyArr.length>1){
                        //多家
                        this.props.navigator.showLightBox({
                            screen: "ChangeCompanyLightBox",
                            passProps: {
                                callback: this.changeCallBack,
                            },
                            style: {
                                backgroundBlur: 'none',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                tapBackgroundToDismiss:true
                            }
                        });
                    }else{
                        //一家或者没有
                        this.push({
                            screen: screen,
                            title:title
                        });
                    }
                },
                (e) => {
                    //一家或者没有
                    this.push({
                        screen: screen,
                        title:title
                    });

                },
            );

        }else if(screen == 'SettingPage'){

            this.push({
                screen: screen,
                title:title,
                passProps: {
                    updateIcon:this.state.updateIcon,
                    //回调!
                    callback: this._updateOpenOrClose,
                }
            });
        }else{
            this.push({
                screen: screen,
                title:title,
            });
        }

    }

    _updateOpenOrClose(updateIcon){

        if(updateIcon!=null){
            console.log("返回是否点击过更新按钮="+updateIcon);
            this.setState({updateIcon: updateIcon,});


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
        paddingTop:Platform.OS==='ios'?70:50,
        paddingBottom:20,
        backgroundColor:'#FFFFFF',
        justifyContent:'space-between'
    },

    head_img:{
        width:60,
        height:60,
        borderRadius: 30,
    },
    login_title_wrapper:{
        width:SCREEN_WIDTH-30-70-22,
        marginTop:13,
        marginLeft:10
    },
    login:{
        fontSize:18,
        color:'#333333',
    },
    company:{
        fontSize:14,
        color:'#999999'
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