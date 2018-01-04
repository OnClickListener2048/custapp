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
                NavigatorSelected = this.props.navigator;
                this.setState({
                    visible: true
                });
            }
            if (event.id === 'willDisappear') {
                this.setState({
                    visible: false
                });
            }
        }else{
            if (event.id === 'willAppear') {
                NavigatorSelected = this.props.navigator;
            }
        }

    }

    componentWillMount() {
        console.log(Platform.OS, '读取审核开关');
        // 只针对ios处理
        if(Platform.OS === 'ios') {
            console.log(Platform.OS, '读取审核开关');
            //读取审核开关
            apis.mobilelogin().then(
                v => {
                    console.log(Platform.OS, '读取审核开关返回值', v);
                    UserInfoStore.setMobileLoginInfo(v).then();
                }, e => {
                    // Toast.show("读取审核开关" + e);
                    console.log("读取审核开关" + e);
                    // 读取失败或者弱网一直打开微信登录
                    UserInfoStore.removeMobileLoginInfo().then();
                }
            );
        } else {
            // Android一直打开微信登录
            // 读取失败或者弱网一直打开微信登录
            UserInfoStore.removeMobileLoginInfo().then();
        }

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

    // _listEmptyComponent(){
    //     let h = 0;
    //     if (DeviceInfo.OS === 'ios'){
    //         h = DeviceInfo.height-64-(DeviceInfo.width*ImageScale)-110*2;
    //     }else{
    //         h = DeviceInfo.height-44-(DeviceInfo.width*ImageScale)-110*2;
    //     }
    //
    //         if(this.state.loadState == 'no-data'){
    //             return(
    //                 <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
    //                     <Text style={{fontSize:setSpText(15),color:'#999999'}}>暂时没有查到相关数据</Text>
    //                     <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请致电客服热线:400-107-0110</Text>
    //                 </View>
    //             )
    //         }else if(this.state.loadState == 'no-net'){
    //             return(
    //                 <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
    //                     <Text style={{fontSize:setSpText(15),color:'#999999'}}>网络请求失败</Text>
    //                     <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请检查您的网络</Text>
    //                 </View>
    //             )
    //
    //         }else if(this.state.loadState == 'error'){
    //             return(
    //                 <View style={{width:DeviceInfo.width, height:h,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
    //                     <Text style={{fontSize:setSpText(15),color:'#999999'}}>网络请求失败</Text>
    //                     <Text style={{fontSize:setSpText(15),color:'#999999',marginTop:10}}>请检查您的网络</Text>
    //                 </View>
    //             )
    //         }else{
    //             //成功
    //             return(
    //                 <View style={{width:DeviceInfo.width, height:h,backgroundColor:'white'}}>
    //
    //                 </View>
    //             )
    //         }
    //
    //
    //
    // }
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
                <View style={{flexDirection:'row',flexWrap:'wrap',flex:1,backgroundColor:'white',borderTopWidth:itemBorder,borderTopColor:'#f9f9f9'}}>
                    {
                        item.item.data.map((item, i) => {

                            let borderStyle = {}
                            if(i%col == (col-1)){
                                borderStyle = {
                                    borderBottomWidth:itemBorder,
                                    borderBottomColor:'#f9f9f9'
                                }
                            }else{
                                borderStyle = {
                                    borderRightWidth:itemBorder,
                                    borderRightColor:'#f9f9f9',
                                    borderBottomWidth:itemBorder,
                                    borderBottomColor:'#f9f9f9'
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
            // let col = 2
            // let itemMargin = 0
            // let itemWidth = (deviceWidth - itemMargin*(col+1))/col
            //
            // return (
            //     <View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap',backgroundColor:'white',borderTopWidth:itemBorder,borderTopColor:'#f9f9f9'}}>
            //         {
            //             item.item.data.map((item, i) => {
            //                 let borderStyle = {}
            //                 if(i%col == (col-1)){
            //                     borderStyle = {
            //                         borderBottomWidth:itemBorder,
            //                         borderBottomColor:'#f9f9f9'
            //                     }
            //                 }else{
            //                     borderStyle = {
            //                         borderRightWidth:itemBorder,
            //                         borderRightColor:'#f9f9f9',
            //                         borderBottomWidth:1,
            //                         borderBottomColor:'#f9f9f9'
            //                     }
            //                 }
            //                 return(
            //                     <TouchableOpacity key={i} onPress={this._goProductDetail.bind(this,item)}>
            //                         <View style={[{width:itemWidth,height:itemWidth*0.42,marginLeft:itemMargin,justifyContent:'center',alignItems:'center',flexDirection:'row'},borderStyle]}>
            //                             <Image resizeMode="contain" style={{ width:28,height:28}} source={{uri:item.icon}}/>
            //                             <Text style={{fontSize:setSpText(14),color:'#666666',marginLeft:10}}>{item.name}</Text>
            //                         </View>
            //                     </TouchableOpacity>
            //                 )
            //             })
            //         }
            //
            //     </View>
            // )
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
            <View style={{height:10}}/>
        )
    }
    _renderSectionHeader(item){
        return(
            <SectionHeader style={{marginTop:10}} text ={item.section.title} />
        )
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
                                <View style={{backgroundColor:'white',width:deviceWidth,marginTop:i?10:0}}>
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
        if(item.url){
            pushJump(this.props.navigator, item.url,item.name);

        }else{
            Toast.show('即将上线，敬请期待...')

        }
    }
    _goColumnDetail(index,item){
        UMTool.onEvent(item.eventId)
        if(item.url){
            pushJump(this.props.navigator, item.url,item.title);

        }else{
            Toast.show('即将上线，敬请期待...')
        }
    }


}

