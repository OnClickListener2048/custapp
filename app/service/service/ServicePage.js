/**
 * 服务标签页
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    InteractionManager,
    Image,
    Platform,
    TouchableOpacity,
    DeviceEventEmitter,
    Animated,
    Dimensions,
} from 'react-native';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PLPCustomNavBar from '../../view/PLPCustomNavBar'
import {isIphoneX} from '../../util/iphoneX-helper'
import Toast from 'react-native-root-toast'
import Alert from "react-native-alert";
import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBar from '../view/TimeSearchBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
const serviceData = [
    {
        title:'现金流',
        logo:require('../../img/xianjinliu.png'),
        jumpPage:'CashFlowPage'
    },
    {
        title:'利润表',
        logo:require('../../img/lirunbiao.png'),
        jumpPage:'ProfitStatementPage'
    },
    {
        title:'纳税表',
        logo:require('../../img/nashuibiao.png'),
        jumpPage:'TaxFormPage'
    },
    {
        title:'应收账款',
        logo:require('../../img/yingshou.png'),
        jumpPage:'AccountsReceivablePage'
    },
    {
        title:'应付账款',
        logo:require('../../img/yingfu.png'),
        jumpPage:'AccountsPayablePage'
    }
]
import pushJump from '../../util/pushJump';

const col = 3
const marg = 0
const itemWidth = (deviceWidth - marg*(col+1))/ col
import {
    Header,
    CustomHeader,
    AccountingTreatment ,
    ClearCard,
    CopyTaxes,
    PayTaxes,
    SendBill
} from './view'
import BComponent from '../../base';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import HeaderView from '../view/HeaderView'
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis';
import demoData from '../serviceDetail/local/ProfitStatementPage.json'
import {deviceHeight, deviceWidth} from "../../util/ScreenUtil";




import Interactable from 'react-native-interactable';

const widthFactor = SCREEN_WIDTH / 375;
const heightFactor = (SCREEN_HEIGHT - 75) / 667;


const timeArr = [
    {
        "relateDate": "2017-01",
        "relateText": "2017年-1月"
    },
    {
        "relateDate": "2016-12",
        "relateText": "2016年-12月"
    },
    {
        "relateDate": "2016-11",
        "relateText": "2016年-11月"
    },
    {
        "relateDate": "2016-10",
        "relateText": "2016年-10月"
    },
    {
        "relateDate": "2016-09",
        "relateText": "2016年-9月"
    },
    {
        "relateDate": "2016-08",
        "relateText": "2016年-8月"
    },
    {
        "relateDate": "2016-07",
        "relateText": "2016年-7月"
    },
    {
        "relateDate": "2016-06",
        "relateText": "2016年-6月"
    },
    {
        "relateDate": "2016-05",
        "relateText": "2016年-5月"
    },
    {
        "relateDate": "2016-04",
        "relateText": "2016年-4月"
    },
    {
        "relateDate": "2016-03",
        "relateText": "2016年-3月"
    }
]

export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        let today = new Date()
        this.state = {
            // selectIndex:0,
            profit:'- -',//本月利润
            income:'- -',//本月收入
            expenditure:'- -',//本月支出
            is_demo:1,//是否演示数据,1演示数据2非演示数据
            isRefreshing:false,
            isClose:false,
            isLoading:true,
            title:'噼里啪财税演示公司',
            isCompanies:false,
            isLogin:false,
            iconUrl:'',//入口图标
            iconWidth:'',
            iconHeight:'',
            url:'',//h5地址
            isShow:false,//是否显示入口

            timeDateArr:timeArr,
            timeIndex:timeArr.length-1

        };
        // this._renderBody=this._renderBody.bind(this);
        this._renderDemo=this._renderDemo.bind(this);
        this.toClose=this.toClose.bind(this);

        this._deltaX = new Animated.Value(0);
        this._deltaY = new Animated.Value(0);
        this._faceScale = new Animated.Value(1);

        this.start = 0;
        this.end = 0;

    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
    onNavigatorEvent(event) {
        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {
            NavigatorSelected = this.props.navigator;
        }
    }

    componentDidMount() {

        this.initData()
        this.refreshEmitter = DeviceEventEmitter.addListener('ChangeCompany', () => {
            this.initData()
        });

    }


    componentWillUnmount() {
        this.refreshEmitter.remove();
    }
    initData(){
        UserInfoStore.isLogined().then(
            logined => {
                if(logined) {
                    //已经登录
                    UserInfoStore.getCompany().then(
                        (company) => {
                            console.log('company', company);
                            if (company && company.id) {
                                this.companyid = company.id
                                this.initYearReport(company.id)
                                //判断是否是多加公司
                                UserInfoStore.getCompanyArr().then(
                                    (companyArr) => {
                                        if(companyArr && companyArr.length>1){
                                            //多家
                                            this.initNavigationBar(true,company.infos[0].value,true,2)

                                        }else{
                                            //一家
                                            this.initNavigationBar(false,company.infos[0].value,true,2)
                                        }
                                    },
                                    (e) => {
                                        //一家
                                        this.initNavigationBar(false,company.infos[0].value,true,2)

                                    },
                                );

                            }else{
                                //没有公司
                                this.companyid = undefined
                                this.initNavigationBar(false,'噼里啪财税演示公司',true,1)
                                this.initYearReport(this.companyid)

                            }

                            this.loadData(this.state.month)

                        },
                        (e) => {
                            this.companyid = undefined
                            this.initYearReport(this.companyid)
                            this.initNavigationBar(false,'噼里啪财税演示公司',true,1)
                            this.loadData(this.state.month)
                        },
                    );
                } else {
                    //未登录
                    this.companyid = undefined
                    this.initYearReport(this.companyid)
                    this.initNavigationBar(false,'噼里啪财税演示公司',false,1)
                    this.loadData(this.state.month)

                }
            },
            e => {
                //未登录
                this.companyid = undefined
                this.initYearReport(this.companyid)
                this.initNavigationBar(false,'噼里啪财税演示公司',false,1)
                this.loadData(this.state.month)
            }
        );

    }
    initYearReport(id){

        if(id){
            apis.loadYearReport(id).then((responseData)=>{
                if(responseData.code == 0 && responseData.data){
                    this.setState({
                        iconUrl:responseData.data.icon.url,//入口图标
                        iconWidth:responseData.data.icon.width,
                        iconHeight:responseData.data.icon.height,
                        url:responseData.data.h5,
                        isShow:responseData.data.isShow,
                    })
                }else{
                    this.setState({
                        isShow:false,
                    })
                }
            },(e)=>{
                this.setState({
                    isShow:false,
                })
            })
        }else{

            this.setState({
                isShow:false,
            })

        }
    }
    initNavigationBar(isCompanies=false,title='噼里啪财税演示公司',isLogin=false,is_demo='1'){

        this.setState({
            title,
            isCompanies,
            isLogin,
            is_demo
        })
    }
    loadData(date='',isPull=false){
        if(isPull){
            this.setState({
                isRefreshing:true
            })
        }else{
            this.setState({
                isLoading:true
            })
        }
        apis.loadServiceData(this.companyid,date).then(
            (responseData) => {

                if(responseData.code == 0){

                    if(responseData.is_demo == '2'){
                        //真实数据
                        this.setState({
                            is_demo:responseData.is_demo?responseData.is_demo:'1',
                            profit:responseData.profit?responseData.profit:'- -',
                            income:responseData.income?responseData.income:'- -',
                            expenditure:responseData.expenditure?responseData.expenditure:'- -',
                            isRefreshing:false,
                            isLoading:false
                        })
                    }else{
                        //演示数据
                        let arr = demoData.list;
                        let today = new Date()
                        let dic = arr[11-today.getMonth()]
                        this.setState({
                            profit:dic.profit,
                            income:dic.income,
                            expenditure:dic.expenditure,
                            isRefreshing:false,
                            isLoading:false
                        })
                    }

                }else{


                    if(this.state.is_demo == 1){
                        //演示数据
                        let arr = demoData.list;
                        let today = new Date()
                        let dic = arr[11-today.getMonth()]
                        this.setState({
                            profit:dic.profit,
                            income:dic.income,
                            expenditure:dic.expenditure,
                            isRefreshing:false,
                            isLoading:false
                        })
                    }else{
                        this.setState({
                            isRefreshing:false,
                            isLoading:false
                        })
                    }


                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {

                if(this.state.is_demo == 1){
                    //演示数据
                    let arr = demoData.list;
                    let today = new Date()
                    let dic = arr[11-today.getMonth()]
                    this.setState({
                        profit:dic.profit,
                        income:dic.income,
                        expenditure:dic.expenditure,
                        isRefreshing:false,
                        isLoading:false
                    })
                }else{
                    this.setState({
                        isRefreshing:false,
                        isLoading:false
                    })
                }
                Toast.show('加载失败！')
            },
        );
    }
    _onRefresh(){
        this.loadData(this.state.month,true)

    }
    _titleItem(){

        if(this.state.isLogin){
            //已登录
            if(this.state.isCompanies){
                //多家
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
                        <View style={{width:deviceWidth*0.55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text numberOfLines={1} style={{fontSize:setSpText(18),fontWeight:'bold',textAlign:'center',color:'white'}}>{this.state.title.length>10?this.state.title.substr(0,10)+'...':this.state.title}&#12288;</Text>
                            <Image source={require('../../img/change_arrow_white.png')}/>
                        </View>

                    </TouchableOpacity>
                )
            }else{
                //一家
                return (
                    <Text numberOfLines={1} style={{fontSize:setSpText(18),fontWeight:'bold',color:'white'}}>{this.state.title.length>10?this.state.title.substr(0,10)+'...':this.state.title}</Text>
                )
            }
        }else{
            //未登录
            return(
                <TouchableOpacity onPress ={()=>{

                    Alert.alert('提示', '立即登录查看您公司的财务数据', [{
                        text: "再看看",
                        onPress: ()=>{
                            console.log('you clicked cancel');
                        },
                        color:'#999999'
                    },
                        {
                            text: "登录",
                            onPress: ()=>{
                                loginJumpSingleton.goToLogin(this.props.navigator);
                            },
                        }]);
                }}>
                    <View style={{width:deviceWidth*0.55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text numberOfLines={1} style={{fontSize:setSpText(18),fontWeight:'bold',textAlign:'center',color:'white'}}>{this.state.title.length>10?this.state.title.substr(0,10)+'...':this.state.title}&#12288;</Text>
                        <Image   source={require('../../img/change_arrow_white.png')}/>
                    </View>

                </TouchableOpacity>
            )
        }




    }


    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {false} isDemo = {this.state.is_demo} isLogin={this.state.isLogin}  titleItem={this._titleItem.bind(this)} navigator={this.props.navigator} year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >
                    <HeaderView
                        hasTop={true}
                        topDes="本月利润"
                        topNum={this.state.profit}
                        leftDes="收入"
                        leftNum={this.state.income}
                        rightDes="支出"
                        rightNum={this.state.expenditure}

                    />
                    <View style={{width:deviceWidth,flexDirection:'row',flexWrap:'wrap',backgroundColor:'white',
                        marginTop: 12}}>
                        {
                            serviceData.map((item,index)=>{
                                let borderRightWidth = 0
                                let borderBottomWidth = 0
                                if (index !=2){
                                    borderRightWidth = DeviceInfo.onePR
                                }
                                if(index <3){
                                    borderBottomWidth = DeviceInfo.onePR
                                }

                                return(
                                    <TouchableOpacity key={index} onPress = {this._goServiceDetail.bind(this,item)}>
                                        <View style={[{width:itemWidth, marginLeft:marg,backgroundColor:'white',height:itemWidth,justifyContent:'center',alignItems:'center',borderColor:'#D7D7D7',borderRightWidth,borderBottomWidth}]}>
                                            <Image resizeMode="contain" source={item.logo} />
                                            <Text style={{color:'#333333',fontSize:setSpText(14), marginTop:13}}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>

                                )
                            })
                        }
                    </View>
                </ScrollView>
                {this._renderDemo(this.state.is_demo)}
                {this._renderYearReport()}
                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>

        )
    }
    _renderYearReport(){

        if(this.state.isShow){

            return(
                <View
                    pointerEvents='box-none'
                    style={styles.container}>
                    <Interactable.View
                        snapPoints={[
                            {x: -140*widthFactor, y: 20*heightFactor}, {x: -140*widthFactor, y: -120*heightFactor}, {x: -140*widthFactor, y:  160*heightFactor}, {x: -140*widthFactor, y: -250*heightFactor}, {x: -140*widthFactor, y: 290*heightFactor},
                            {x:  140*widthFactor, y: 20*heightFactor}, {x:  140*widthFactor, y:  160*heightFactor}, {x:  140*widthFactor, y: -120*heightFactor}, {x:  140*widthFactor, y: -250*heightFactor}, {x:  140*widthFactor, y: 290*heightFactor}]}
                        dragWithSpring={{tension: 2000, damping: 0.5}}
                        animatedValueX={this._deltaX}
                        animatedValueY={this._deltaY}
                        onDrag={this.onDrawer.bind(this)}
                        initialPosition={{x: (SCREEN_WIDTH/2-40)*widthFactor-20, y: (SCREEN_HEIGHT/4)*heightFactor}}>
                        <Animated.View
                            style={[{width:this.state.iconWidth, height:this.state.iconHeight}, {
                                transform: [{
                                    scale: this._faceScale
                                }]
                            }]}>
                            <TouchableOpacity onPress = {this._goWeb.bind(this)}>
                                <Image style={{width:this.state.iconWidth, height:this.state.iconHeight}} source={{uri:this.state.iconUrl}} />
                            </TouchableOpacity>
                        </Animated.View>
                    </Interactable.View>
                </View>
            )

        }
    }
    onDrawer(e){
        if(e.nativeEvent.state == 'start'){
            this.start = e.nativeEvent.y
        }
        if(e.nativeEvent.state == 'end'){
            this.end = e.nativeEvent.y
            let result = Math.abs(this.end - this.start)
            if((Platform.OS==='android') && result<1){
                //点击事件
                if(this.state.url){
                    UMTool.onEvent('2017accountTable')
                    pushJump(this.props.navigator,this.state.url,'年度报表','噼里啪智能财税','年度报表');
                }
            }
        }
    }
    _goWeb(){
        if((Platform.OS==='ios') && this.state.url){
            UMTool.onEvent('2017accountTable')
            pushJump(this.props.navigator,this.state.url,'年度报表','噼里啪智能财税','年度报表');
        }
    }


    _callback(index){
        // this.setState({
        //     select:month
        // })
        // this.loadData(month)
        this.setState({
            timeIndex:index
        })
        // alert(this.state.timeDateArr[index].relateDate)
        // this.loadData(this.state.timeDateArr[index].relateDate)


    }
    _goServiceDetail(item){

        this.push({
            screen: item.jumpPage,
            title:item.title,
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                month:this.state.month,
                callback:this._callback.bind(this),
                companyid:this.companyid,
                is_demo:this.state.is_demo
            }
        })
    }


    toClose(){
        this.setState(
            {
                isClose:true
            }
        )
    }

    _renderDemo(isDemo){
        if(isDemo==1&&!this.state.isClose) {
            return (
                <View>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: DeviceInfo.width,
                    height: 190,
                    backgroundColor: 'rgba(00, 00, 00, 0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                      pointerEvents='none'
                >
                    <Image style={styles.service_demo_img}
                           source={require('../../img/service_demo_img.png')}
                           >
                    </Image>
                </View>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: DeviceInfo.width,
                        height: 100,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                          pointerEvents='box-none'
                    >
                        <TouchableOpacity onPress={()=>this.toClose()}>
                        <Image style={{resizeMode : "contain",marginTop:18}} source={require('../../img/service_demo_close.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>

            );
        }
    }
}

const styles = StyleSheet.create({
    wrapper1:{
        width:SCREEN_WIDTH,
        flexDirection:'row',
        marginTop:30,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:20

    },
    wrapper2:{
        flexDirection:'row',


    },
    wrapper3:{
        width:SCREEN_WIDTH,
        justifyContent:'center',
        marginTop:30,
        alignItems:'center'
    },
    wrapper4:{
        flexDirection:'row',
        marginHorizontal:10,
        marginTop:5
    },
    line:{
        height:1,
        width:(SCREEN_WIDTH-62.5-40)/5,
        borderBottomColor:'#e13238',
        borderBottomWidth:1 ,
        backgroundColor:'transparent',
    },
    service_gray_bg:{
        width:26,
        height:26,
        alignItems:'center',
        justifyContent:'center',
    },
    te_black:{
        fontSize:12,
        color:'#666666',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor:'transparent',
    },
    te_white:{
        fontSize:12,
        color:'#FFFFFF',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor:'transparent',

    },
    service_demo_img:{
        resizeMode : "contain",
        justifyContent: 'center',
        alignItems: 'center',
        width:SCREEN_WIDTH-16
    },


    container: {
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
        position:'absolute'
    },
});
