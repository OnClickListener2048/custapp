/**
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
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

import {
    Header,
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

export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        let today = new Date()
        this.state = {
            selectIndex:0,
            profit:'- -',//本月利润
            income:'- -',//本月收入
            expenditure:'- -',//本月支出
            is_demo:1,//是否演示数据,1演示数据2非演示数据
            year:today.getFullYear().toString(),
            month:(today.getMonth() + 1).toString(),
            isRefreshing:false,
            isClose:false,
            isLoading:true

        };
        this._renderBody=this._renderBody.bind(this);
        this._renderDemo=this._renderDemo.bind(this);
        this.toClose=this.toClose.bind(this);

    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
    btnClick(index){
        let eventArr = ['s_copiestax','s_sendbill','s_finance','s_applyTax','s_clearCard'];
        UMTool.onEvent(eventArr[index])
        this.setState({
            selectIndex:index
        })
    }

    componentDidMount() {

        this.initData()
        this.refreshEmitter = DeviceEventEmitter.addListener('refreshService', () => {
            this.initData()
        });

    }
    componentWillUnmount() {
        this.refreshEmitter.remove();
    }
    initData(){
        UserInfoStore.getCompany().then(
            (company) => {
                console.log('company', company);
                if (company && company.id) {
                    this.companyid = company.id
                    this.setState({
                        is_demo:2
                    })
                }else{
                    this.companyid = undefined
                    this.setState({
                        is_demo:1
                    })
                }
                this.loadData(this.state.year+'-'+this.state.month)

            },
            (e) => {
                this.setState({
                    is_demo:1
                })
                this.loadData(this.state.year+'-'+this.state.month)
            },
        );
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


                    // Toast.show(responseData.msg?responseData.msg:'加载失败！')
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
                // Toast.show('加载失败！')
            },
        );
    }
    _onRefresh(){
        this.loadData(this.state.year+'-'+this.state.month,true)

    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#ffffff'}}>
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

                    <View style={styles.wrapper1}>
                        <View style={[styles.line,{width:30}]}/>
                        <Text style={{fontSize:24,color:'#e13238',marginHorizontal:10}}>
                            本月清单
                        </Text>
                        <View style={[styles.line,{width:30}]}/>
                    </View>
                    <Header btnClick={this.btnClick.bind(this)} selectIndex={this.state.selectIndex} />
                    {this._renderBody(this.state.selectIndex)}
                </ScrollView>
                {this._renderDemo(this.state.is_demo)}
                <PLPActivityIndicator isShow={this.state.isLoading} />
                <ChooseTimerModal disabled={this.state.is_demo == '1'?true:false} ref="ChooseTimerModal" yearSelected={this.state.year} monthSelected={this.state.month} callback ={this._callback.bind(this)}/>
            </View>

        )
    }
    _callback(year,month,isRefresh=false){

        let _this = this
        _this.loadData(year+'-'+month)
        _this.setState({
            year,
            month
        },function () {
            if(isRefresh){
                _this.refs.ChooseTimerModal.setState({
                    yearSelected:year,
                    monthSelected:month
                })
            }
        })


    }
    _renderBody(index){

        switch (index){
            case 0:
                return <CopyTaxes />//抄税
                break;
            case 1:
                return <SendBill />//发送票据
                break;
            case 2:
                return <AccountingTreatment push={this.push} callback ={this._callback.bind(this)} year={this.state.year} month={this.state.month}  navigator={this.props.navigator} companyid={this.companyid} is_demo={this.state.is_demo} />//财务处理
                break;
            case 3:
                return <PayTaxes push={this.push} callback ={this._callback.bind(this)} year={this.state.year} month={this.state.month}  navigator={this.props.navigator} companyid={this.companyid} is_demo={this.state.is_demo}/>//申报纳税
                break;
            case 4:
                return <ClearCard/>//清卡
                break;
        }
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



});
