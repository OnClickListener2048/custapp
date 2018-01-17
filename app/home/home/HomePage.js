/**
 * Created by zhuangzihao on 2017/9/8.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    SectionList,
    Dimensions,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
    StyleSheet,
    Animated,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';
import SectionHeader from '../../view/SectionHeader'
import * as apis from '../../apis';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import BComponent from '../../base';
import {scaleSize} from  '../../util/ScreenUtil'
import Toast from 'react-native-root-toast'
import pushJump from '../../util/pushJump';

import Swiper from 'react-native-swiper';
import ViewPagerWrapper from '../../view/ViewPagerWrapper'
const ImageScale = 0.42
import {isIphoneX} from '../../util/iphoneX-helper'

import {H5_URL} from '../../config'
const deviceWidth = Dimensions.get('window').width;


const itemBorder = 1

let headerData = null;// 延迟到willmount时初始化, 解决切换域名带来得问题
const footData = [
    {
        'title':'安全',
        "logo":require('../../img/safe.png')
    },
    {
        'title':'专业',
        "logo":require('../../img/major.png')
    },
    {
        'title':'价优',
        "logo":require('../../img/money.png')
    },
    {
        'title':'智能',
        "logo":require('../../img/Intelligence.png')
    },
    {
        'title':'放心',
        "logo":require('../../img/worry.png')
    },
    {
        'title':'贴心',
        "logo":require('../../img/peace.png')
    }
]
import BannerView from '../../view/BannerView'
import * as WeChat from "react-native-wechat";

export default class HomePage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource:[],
            loadState:'success',
            isRefreshing:false,
            isFirstRefresh:true,
            isLoading:true,
            bannerData:[],
        };
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    onNavigatorEvent(event) {
        super.onNavigatorEvent(event);
        if (event.id === 'willAppear') {
            NavigatorSelected = this.props.navigator;
        }

    }

    componentWillMount() {
        this._checkWechatLogin();
        headerData = [
            {
                title:'热门产品',
                UItype:1,
                productArr:[
                    {
                        title:'注册公司',
                        logo:require('../../img/register.png'),
                        url:H5_URL+'register?showFooterTab=true',
                        eventId:'registerCompany'
                    },
                    {
                        title:'记账报税',
                        logo:require('../../img/Accounting.png'),
                        url:H5_URL+'accounting?showFooterTab=true',
                        eventId:'accountingAndTax'
                    },
                    {
                        title:'企业变更',
                        logo:require('../../img/changeConpany.png'),
                        url:H5_URL+'change?showFooterTab=true',
                        eventId:'enterpriseChange'
                    },
                ],
            },
            {
                title:'实用工具',
                UItype:2,
                productArr:[
                    {
                        title:'免费核名',
                        logo:require('../../img/check_name.png'),
                        url:'pilipa://view.company.check',
                        eventId:'homepage_checkname'
                    },
                    {
                        title:'发票验真',
                        logo:require('../../img/fapiao.png'),
                        url:'',
                        eventId:'InvoiceTruth'
                    },
                ],
            },
        ]
    }

    // 初始化苹果审核微信登录开关信息
    _checkWechatLogin = () => {
        // 只针对ios处理
        if(Platform.OS === 'ios') {
            let mobileLoginInfo = {code: 0, open: true, mobile: "18777777777", passwd: "123456", token: "191c7e2d-b1ea-4956-801f-5cd647884904"};
            console.log(Platform.OS, '读取审核开关');

            WeChat.isWXAppInstalled().then(
                v => {
                    if (!v) {// 未安装微信, 直接打开手机登陆界面
                        console.log(Platform.OS, '未安装微信, 审核开关设置为手机登陆');
                        UserInfoStore.setMobileLoginInfo(mobileLoginInfo).then();
                    } else {
                        //读取审核开关
                        apis.mobilelogin().then(
                            v => {
                                console.log(Platform.OS, '读取审核开关返回值', v);
                                UserInfoStore.setMobileLoginInfo(v).then();
                            }, e => {
                                console.log("读取审核开关" + e);
                                // 读取失败或者弱网一直打开微信登录
                                UserInfoStore.removeMobileLoginInfo().then();
                            }
                        );
                    }
                },
                e => {
                    // 微信安装检测失败, 直接打开手机登陆界面, 防止iOS审核失败
                    console.log(e);
                    UserInfoStore.setMobileLoginInfo(mobileLoginInfo).then();
                }
            );
        } else {
            // Android一直打开微信登录
            UserInfoStore.removeMobileLoginInfo().then();
        }


    };

    componentWillUnmount() {
        this.subscription.remove();
    }

    componentDidMount(){
        this.loadData();
        // 登陆处理
        this.subscription = DeviceEventEmitter.addListener('goLoginPage', (data)=>{
            console.log('goLoginPage loginJumpSingleton.isJumpingLogin=', loginJumpSingleton.isJumpingLogin);
            loginJumpSingleton.goToLogin(this.props.navigator);
        });

    }

    loadData(type = '0'){
        // let loading
        if(this.state.isFirstRefresh){
            //第一次加载显示菊花loading

            this.setState({
                isLoading:true
            })

        }else{
            //显示下拉loading
            this.setState({
                isRefreshing:true
            })
        }
        apis.loadHomeData(type).then(
            (responseData) => {
                if(responseData.code == 0){

                    //成功后处理数据
                    let dataSource = [];
                    let section = {
                        key:responseData.list,
                        data:[{type:'header'}]
                    }
                    dataSource.push(section)

                    for (let i = 0; i<responseData.list.length;i++){
                        let section = {};
                        section.title = responseData.list[i].name;
                        section.key = 'section'+ i;
                        //showtype
                        section.data = [{data:responseData.list[i].products,type:responseData.list[i].showtype?responseData.list[i].showtype:'1'}];
                        for(let j=0;j<section.data.length;j++){

                            section.data[j].key = 'row'+ j
                        }
                        dataSource.push(section)
                    }

                    //修改状态
                    if(responseData.list.length == 0){
                        //没数据
                        this.setState({
                            loadState:'no-data',
                            isLoading:false,
                            isFirstRefresh:false,
                            isRefreshing:false
                        })
                    }else{
                        //成功
                        this.setState({
                            dataSource:dataSource,
                            loadState:'success',
                            isFirstRefresh:false,
                            isLoading:false,
                            isRefreshing:false

                        })
                    }

                }else{
                    //加载失败
                    this.setState({
                        loadState:'error',
                        isLoading:false,
                        isRefreshing:false,
                        isFirstRefresh:false,
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')

                }
            },
            (e) => {
                Toast.show('加载失败！');

                //加载失败
                this.setState({
                    loadState:NetInfoSingleton.isConnected?'error':'no-net',
                    isLoading:false,
                    isRefreshing:false,
                    isFirstRefresh:false,
                })
            },
        );
        apis.loadHomeBanner().then(
            (responseData) => {
                if(responseData.code == 0 && responseData.list){
                    this.setState({
                        bannerData:responseData.list
                    })

                }
            },
            (e) => {

            },
        );
    }


    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <SectionList
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    sections={this.state.dataSource}
                    stickySectionHeadersEnabled={false}
                    // ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    ListFooterComponent={this._listFooterComponent.bind(this)}
                    // ListEmptyComponent={this._listEmptyComponent.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                >
                </SectionList>
                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>
        )
    }
    _onRefresh(){
        this.loadData()
    }
    _renderItem (item) {


        if(item.item.type == '1'){
            let col = 4
            let itemMargin = 0
            let itemWidth = (deviceWidth - itemMargin*(col+1))/col
            return(
                <View style={{flexDirection:'row',flexWrap:'wrap',flex:1,backgroundColor:'white'}}>
                    {
                        item.item.data.map((item, i) => {

                            let borderStyle = {}
                            if(i%col == (col-1)){
                                borderStyle = {
                                    borderBottomWidth:itemBorder,
                                    borderBottomColor:'#D7D7D7'
                                }
                            }else{
                                borderStyle = {
                                    borderRightWidth:itemBorder,
                                    borderRightColor:'#D7D7D7',
                                    borderBottomWidth:itemBorder,
                                    borderBottomColor:'#D7D7D7',
                                    borderTopWidth:itemBorder,borderTopColor:'#D7D7D7'
                                }
                            }
                            // let borderStyle = {
                            //     borderRightWidth:1,
                            //     borderRightColor:'#f9f9f9',
                            //     borderBottomWidth:1,
                            //     borderBottomColor:'#f9f9f9'
                            // }
                            return(
                                <TouchableOpacity key={i} onPress={this._goProductDetail.bind(this,item)}>
                                    <View style={[{width:itemWidth,height:itemWidth,marginLeft:itemMargin,justifyContent:'center',alignItems:'center'},borderStyle]}>
                                        <Image resizeMode="contain" style={{marginTop:10, width:28,height:28}} source={{uri:item.icon}}/>
                                        <Text style={{marginTop:15,marginBottom:10,fontSize:setSpText(14),color:'#666666'}}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }else if(item.item.type == '2'){

            return (
                <View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',paddingBottom:20,backgroundColor:'white'}}>
                    {
                        item.item.data.map((item, i) => {
                            return(
                                <TouchableOpacity key={i} onPress={this._goProductDetail.bind(this,item)}>
                                    <Image resizeMode="cover" style={{justifyContent:'center',alignItems:'center',width:136,height:68,marginTop:10}} source={{uri:item.icon}}>
                                        <Text style={{backgroundColor:'transparent',fontSize:setSpText(16),color:'white',fontWeight:'bold'}}>{item.name}</Text>
                                    </Image>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            )
        }else if(item.item.type == 'header'){
            return <View>
                {this._listHeaderComponent()}
            </View>
        }else{
            return <View />
        }



    }
    _listFooterComponent(){
        return(
            <View style={{height:10}}/>
        )
    }
    _renderSectionHeader(item){

        if(item.section.title){
            return(
                <SectionHeader style={{marginTop:10}} text ={item.section.title} />
            )
        }else {
            return <View />
        }

    }
    _listHeaderComponent(){

        let col = 3;
        let marginLeft= 0;
        let width = (deviceWidth - marginLeft*(col+1))/col

        return(
            <View style={{width:DeviceInfo.width, marginTop:DeviceInfo.OS==='ios'?isIphoneX()?0:-20:0}}>
                {this._renderBannerView()}
                <View style={{flexDirection:'row',width:deviceWidth,flexWrap:'wrap'}}>
                    {
                        headerData.map((item,i)=>{
                            return(
                                <View key={i} style={{backgroundColor:'white',width:deviceWidth,marginTop:i?10:0}}>
                                    <SectionHeader style={{marginTop:10}} text ={item.title} />
                                    {item.UItype === 1 ?<View style={{flexDirection:'row',width:deviceWidth,backgroundColor:'white',flexWrap:'wrap'}}>
                                        {
                                            item.productArr.map((pro,i)=>{
                                                return(
                                                    <TouchableOpacity key={i}  onPress={()=>this._goColumnDetail(i,pro)}>
                                                        <View style={{justifyContent:'center',alignItems:'center',width,marginLeft,
                                                            height:width}}>
                                                            <Image  source={pro.logo }/>
                                                            <Text  style={{marginTop:15,fontSize:setSpText(16),color:'#666666',marginBottom:20}}>{pro.title}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>:<View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',paddingBottom:20,backgroundColor:'white'}}>
                                        {
                                            item.productArr.map((pro, i) => {
                                                return(
                                                    <TouchableOpacity key={i}  onPress={()=>this._goColumnDetail(i,pro)}>
                                                        <Image resizeMode="cover" style={{justifyContent:'center',alignItems:'center',marginTop:10}} source={pro.logo }>
                                                            <Text style={{backgroundColor:'transparent',fontSize:setSpText(22),color:'white',fontWeight:'bold'}}>{pro.title}</Text>
                                                        </Image>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }

                                    </View>}
                                </View>
                            )
                        })
                    }
                    <View style={{width:deviceWidth,paddingTop:10,backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <View style={{height:DeviceInfo.onePR,backgroundColor:'#D8D8D8',width:24,marginRight:15}}/>
                        <Text style={{color:'#999999',fontSize:setSpText(18)}}>
                            小企业的财税管家
                        </Text>
                        <View style={{height:DeviceInfo.onePR,backgroundColor:'#D8D8D8',width:24,marginLeft:15}}/>
                    </View>
                </View>
            </View>

        )
    }
    _renderBannerView(){
        if(Platform.OS === 'ios'){
            return(
                <Swiper
                    style={{height:deviceWidth*ImageScale}}
                    loop = {true}
                    autoplayTimeout={5}
                    autoplay = {true}
                    index = {0}
                    showsPagination = {true}
                    paginationStyle={{bottom:5}}
                    dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 6, height: 6,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                    activeDot={<View style={{backgroundColor: '#323232', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                >
                    {
                        this.state.bannerData.map((item,index)=>{
                            return(
                                <TouchableWithoutFeedback key={index} onPress = {this._goBannerDetail.bind(this,item)}>
                                    <Image resizeMode="cover" source={{uri:item.img}} style={{width:deviceWidth,height:DeviceInfo.width*ImageScale}} />
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </Swiper>
            );
        }else{
            return(
                <ViewPagerWrapper navigator={this.props.navigator}>
                    <Swiper
                        style={{height:deviceWidth*ImageScale}}
                        loop = {true}
                        autoplayTimeout={5}
                        autoplay = {true}
                        index = {0}
                        showsPagination = {true}
                        paginationStyle={{bottom:5}}
                        dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 6, height: 6,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                        activeDot={<View style={{backgroundColor: '#323232', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                    >
                        {
                            this.state.bannerData.map((item,index)=>{
                                return(
                                    <TouchableWithoutFeedback key={index} onPress = {this._goBannerDetail.bind(this,item)}>
                                        <Image resizeMode="cover" source={{uri:item.img}} style={{width:deviceWidth,height:DeviceInfo.width*ImageScale}} />
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </Swiper>
                </ViewPagerWrapper>
            )
        }

    }
    _goBannerDetail(item){
        UMTool.onEvent(item.eventsid)
        pushJump(this.props.navigator, item.url,item.name,'噼里啪智能财税',item.name,item.eventId);
    }
    _goProductDetail(item){

        UMTool.onEvent(item.eventId)
        if(item.url){
            pushJump(this.props.navigator, item.url,item.name,'噼里啪智能财税',item.name,item.eventId);

        }else{
            Toast.show('即将上线，敬请期待...')

        }
    }
    _goColumnDetail(index,item){
        UMTool.onEvent(item.eventId)
        if(item.url){
            pushJump(this.props.navigator, item.url,item.title,'噼里啪智能财税',item.title,item.eventId);

        }else{
            Toast.show('即将上线，敬请期待...')
        }
    }


}

