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
    TouchableOpacity
} from 'react-native';
import Toast from 'react-native-root-toast'

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
export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        let today = new Date()
        this.state = {
            selectIndex:0,
            profit:'- -',//本月利润
            income:'- -',//本月收入
            expenditure:'- -',//本月支出
            is_demo:1,//是否演示数据,
            year:today.getFullYear().toString(),
            month:(today.getMonth() + 1).toString(),
            isRefreshing:false

        };
        this._renderBody=this._renderBody.bind(this);
        this._renderDemo=this._renderDemo.bind(this);
        this.goBuy=this.goBuy.bind(this);

    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };
    btnClick(index){
        this.setState({
            selectIndex:index
        })
    }

    componentDidMount() {

        this.loadData('1',this.state.year+'-'+this.state.month)
    }
    loadData(companyid = '1',date='',isPull=false){
        let loading
        if(isPull){
            this.setState({
                isRefreshing:true
            })
        }else{
            loading = SActivityIndicator.show(true, "加载中...");
        }
        apis.loadServiceData(companyid,date).then(
            (responseData) => {
                SActivityIndicator.hide(loading);
                if(responseData.code == 0){

                    this.setState({
                        is_demo:responseData.is_demo,
                        profit:responseData.profit,
                        income:responseData.income,
                        expenditure:responseData.expenditure,
                        isRefreshing:false
                    })
                }else{
                    this.setState({
                        isRefreshing:false
                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    isRefreshing:false
                })
                Toast.show('加载失败！')
            },
        );
    }
    _onRefresh(){
        this.loadData('1',this.state.year+'-'+this.state.month,true)

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
                        topNum={'¥'+this.state.profit}
                        leftDes="收入"
                        leftNum={'¥'+this.state.income}
                        rightDes="支出"
                        rightNum={'¥'+this.state.expenditure}
                    />

                    <View style={styles.wrapper1}>
                        <View style={[styles.line,{width:30}]}/>
                        <Text style={{fontSize:24,color:'#e13238',marginHorizontal:10}}>
                            本月进度
                        </Text>
                        <View style={[styles.line,{width:30}]}/>
                    </View>
                    <Header btnClick={this.btnClick.bind(this)} selectIndex={this.state.selectIndex} />
                    {this._renderBody(this.state.selectIndex)}
                </ScrollView>
                {this._renderDemo(this.state.is_demo)}
                <ChooseTimerModal ref="ChooseTimerModal" yearSelected={this.state.year} monthSelected={this.state.month} callback ={this._callback.bind(this)}/>
            </View>

        )
    }
    _callback(year,month,isRefresh=false){

        let _this = this
        InteractionManager.runAfterInteractions(() => {
            _this.loadData('1',year+'-'+month)
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
        });


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
                return <AccountingTreatment callback ={this._callback.bind(this)} year={this.state.year} month={this.state.month}  navigator={this.props.navigator} />//财务处理
                break;
            case 3:
                return <PayTaxes callback ={this._callback.bind(this)} year={this.state.year} month={this.state.month}  navigator={this.props.navigator} />//申报纳税
                break;
            case 4:
                return <ClearCard/>//清卡
                break;
        }
    }

    goBuy(){
        this.props.navigator.switchToTab({
            tabIndex: 0
        });
    }

    _renderDemo(isDemo){
        if(isDemo==1) {
            return (
                <View>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: DeviceInfo.width,
                    height: 190,
                    backgroundColor: 'rgba(00, 00, 00, 0.5)',
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
                        height: 40,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                          pointerEvents='box-none'
                    >
                        <TouchableOpacity onPress={()=>this.goBuy()}>
                        <Image style={{resizeMode : "contain",marginBottom:40}} source={require('../../img/service_demo_buy.png')}/>
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