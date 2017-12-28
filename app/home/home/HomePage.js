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

const ImageScale = 0.42
import {isIphoneX} from '../../util/iphoneX-helper'

import {H5_URL} from '../../config'
const deviceWidth = Dimensions.get('window').width;
const col = 4
const itemMargin = scaleSize(10)
const itemWidth = (deviceWidth - itemMargin*(col+1))/col
const headerData = [
    {
        title:'注册公司',
        logo:require('../../img/register.png'),
        url:H5_URL+'register?platform=app&showFooterTab=true',
        eventId:'registerCompany'
    },
    {
        title:'记账报税',
        logo:require('../../img/Accounting.png'),
        url:H5_URL+'accounting?platform=app&showFooterTab=true',
        eventId:'accountingAndTax'
    },
    {
        title:'企业变更',
        logo:require('../../img/changeConpany.png'),
        url:H5_URL+'change?platform=app&showFooterTab=true',
        eventId:'enterpriseChange'
    },
    {
        title:'财务报表',
        logo:require('../../img/Finance.png'),
        url:'pilipa://tab.service',
        eventId:'financialReport'
    },
    {
        title:'免费核名',
        logo:require('../../img/check_name.png'),
        url:'pilipa://view.company.check',
        eventId:'homepage_checkname'
    },
    {
        title:'加盟合作',
        logo:require('../../img/registerConpany1.png'),
        url:H5_URL+'invest?platform=app',
        eventId:'leagueCooperation'
    }
]
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
            visible: true
        };
        this._index = 0
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

    onNavigatorEvent(event) {
        super.onNavigatorEvent(event);
        if(DeviceInfo.OS === 'android'){
            if (event.id === 'willAppear') {
                this.setState({
                    visible: true
                });
            }
            if (event.id === 'willDisappear') {
                this.setState({
                    visible: false
                });
            }
        }

    }

    componentWillMount() {
        // 只针对ios处理
        if(Platform.OS === 'ios') {
            console.log(Platform.OS, '读取审核开关');
            // 读取审核开关
            apis.mobilelogin().then(
                v => {
                    UserInfoStore.setMobileLoginInfo(v).then();
                }, e => {
                    console.log(e);
                    // UserInfoStore.removeMobileLoginInfo().then();
                    // 读取失败或者弱网一直打开微信登录
                    this.setState({openMobileLogin: false});
                    this.setState({mobileLogin: false});
                }
            );
        } else {
            // Android一直打开微信登录
            this.setState({openMobileLogin: false});
            this.setState({mobileLogin: false});
        }
    }

    componentWillUnmount() {
    }

    componentDidMount(){
        this.loadData()
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
                    for (let i = 0; i<responseData.list.length;i++){
                        let section = {};
                        section.title = responseData.list[i].name;
                        section.key = i;
                        //showtype
                        section.data = [{data:responseData.list[i].products,type:responseData.list[i].showtype?responseData.list[i].showtype:'1'}];
                        for(let j=0;j<section.data.length;j++){
                            section.data[j].key = j
                        }
                        dataSource[i] = section
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

    _listEmptyComponent(){
        let h = 0;
        if (DeviceInfo.OS === 'ios'){
            h = DeviceInfo.height-64-(DeviceInfo.width*ImageScale)-110*2;
        }else{
            h = DeviceInfo.height-44-(DeviceInfo.width*ImageScale)-110*2;
        }

            if(this.state.loadState == 'no-data'){
                return(
                    <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:setSpText(15),color:'#999999'}}>暂时没有查到相关数据</Text>
                        <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请致电客服热线:400-107-0110</Text>
                    </View>
                )
            }else if(this.state.loadState == 'no-net'){
                return(
                    <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:setSpText(15),color:'#999999'}}>网络请求失败</Text>
                        <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请检查您的网络</Text>
                    </View>
                )

            }else if(this.state.loadState == 'error'){
                return(
                    <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:setSpText(15),color:'#999999'}}>网络请求失败</Text>
                        <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请检查您的网络</Text>
                    </View>
                )
            }else{
                //成功
                return(
                    <View style={{width:DeviceInfo.width, height:h,backgroundColor:'white'}}>

                    </View>
                )
            }



    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#f9f9f9'}}>
                <SectionList
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    sections={this.state.dataSource}
                    stickySectionHeadersEnabled={false}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    ListFooterComponent={this._listFooterComponent.bind(this)}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
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
            return(
                <View style={{flexDirection:'row',flexWrap:'wrap',flex:1,paddingBottom:10,backgroundColor:'white'}}>
                    {
                        item.item.data.map((item, i) => {
                            return(
                                <TouchableOpacity key={i} onPress={this._goProductDetail.bind(this,item)}>
                                    <View style={{width:itemWidth,marginLeft:itemMargin,justifyContent:'center',alignItems:'center'}}>
                                        <Image resizeMode="contain" style={{marginTop:10, width:25,height:25}} source={{uri:item.icon}}/>
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
        }else{
            return null
        }


    }
    _listFooterComponent(){
        return(
            <View style={{backgroundColor:'white'}}>
                <View style={{width:deviceWidth,height:10,backgroundColor:'#F9F9F9'}}/>
                <View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap'}}>
                    {
                        footData.map((item,index)=>{
                            return (
                                <View key={index} style={[{width:deviceWidth/3,flexDirection:'row',padding:10,justifyContent:'center',alignItems:'center'},index<3?{borderBottomWidth:1.5,borderBottomColor:'#f9f9f9'}:{},index%3<2?{borderRightWidth:1.5,borderRightColor:'#f9f9f9'}:{}]}>
                                    <Image resizeMode="contain" style={{width:25, height:25}} source={item.logo}/>
                                    <Text style={{fontSize:setSpText(14), color:'#333333',marginLeft:10}}>{item.title}</Text>
                                </View>
                            )
                        })
                    }
                    <View style={{width:deviceWidth,justifyContent:'center',alignItems:'center',padding:30,backgroundColor:'#F9F9F9'}}>
                        <Text style={{color:'#F9990A',fontSize:setSpText(18)}}>小企业财税管家</Text>
                        <Text style={{fontSize:12,color:'#999999',marginTop:5}}>热线电话：400-107-0110</Text>
                    </View>
                </View>
            </View>

        )
    }
    _renderSectionHeader(item){
        return(
            <SectionHeader style={{marginTop:10}} text ={item.section.title} />
        )
    }
    _listHeaderComponent(){

        let col = 3;
        let marginLeft= 40;
        let width = (deviceWidth - marginLeft*(col+1))/col

        return(
            <View style={{width:DeviceInfo.width, marginTop:DeviceInfo.OS==='ios'?isIphoneX()?0:-20:0}}>
                {this._renderBannerView()}
                <View style={{flexDirection:'row',width:deviceWidth,backgroundColor:'white',flexWrap:'wrap'}}>
                    {
                        headerData.map((item,i)=>{
                            return(
                                <TouchableOpacity key={i}  onPress={()=>this._goColumnDetail(i,item)}>
                                    <View style={{justifyContent:'center',alignItems:'center',width,marginLeft}}>
                                        <Image style={{marginTop:20,width:width-20, height:width-20}} source={item.logo }/>
                                        <Text  style={{marginTop:15,fontSize:setSpText(12),color:'#666666',marginBottom:20}}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>

        )
    }
    _renderBannerView(){

        // return(
        //     <BannerView
        //         style={{height:deviceWidth*ImageScale}}
        //         bannerData = {this.state.bannerData}
        //         imageKey="img"
        //     />
        // )
        if(this.state.visible){
            return(
                <Swiper
                    style={{height:deviceWidth*ImageScale}}
                    loop = {true}
                    autoplayTimeout={5}
                    autoplay = {true}
                    index={this._index}
                    showsPagination = {true}
                    paginationStyle={{bottom:5}}
                    dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 6, height: 6,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                    activeDot={<View style={{backgroundColor: '#323232', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                    onIndexChanged ={(index)=>{this._index = index}}
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
            return <View style={{height:deviceWidth*ImageScale}}/>
        }


    }
    _goBannerDetail(item){
        UMTool.onEvent(item.eventsid)
        pushJump(this.props.navigator, item.url,item.name);
    }
    _goProductDetail(item){

        UMTool.onEvent(item.eventId)
        pushJump(this.props.navigator, item.url,item.name);
    }
    _goColumnDetail(index,item){
        UMTool.onEvent(item.eventId)
        pushJump(this.props.navigator, item.url,item.title);
    }


}

