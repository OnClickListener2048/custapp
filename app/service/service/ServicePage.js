/**
 * Created by liufei on 2017/9/25.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    ScrollView,
    ImageBackground

} from 'react-native';

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


export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {

            selectIndex:0

        };
        this.isDemo=false;//是否是显示数据
        this._renderBody=this._renderBody.bind(this);
        this._renderDemo=this._renderDemo.bind(this);
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

    render(){
        return(
            <View style={{flex:1,position:'relative'}}>
            <ScrollView style={{flex:1,backgroundColor:'#FFFFFF'}}>
                <HeaderView
                    hasTop={true}
                    topDes="本月利润"
                    topNum="¥30,000.00"
                    leftDes="收入"
                    leftNum="¥30,000.00"
                    rightDes="支出"
                    rightNum="¥30,000.00"
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
                {this._renderDemo(this.isDemo)}
                <ChooseTimerModal />


            </View>

        )
    }



    _renderBody(index){
        switch (index){
            case 0:
                return <CopyTaxes {...this.props}/>//抄税
                break;
            case 1:
                return <SendBill {...this.props} />//发送票据
                break;
            case 2:
                return <AccountingTreatment {...this.props} />//财务处理
                break;
            case 3:
                return <PayTaxes {...this.props} />//申报纳税
                break;
            case 4:
                return <ClearCard {...this.props} />//清卡
                break;
        }
    }

    _renderDemo(isDemo){
        if(isDemo) {
            return (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: DeviceInfo.width,
                    height: 160,
                    backgroundColor: 'rgba(00, 00, 00, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                      pointerEvents='none'>
                    <Image style={styles.service_demo_img} source={require('../../img/service_demo_img.png')}/>
                    <Text style={[styles.demo_te, {marginTop: 20}]}>
                        以上为功能演示
                    </Text>
                    <Text style={[styles.demo_te, {marginTop: 10}]}>
                        您目前还没有公司购买相关服务！
                    </Text>
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
        justifyContent:'center'

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
        marginTop:10
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
        resizeMode : "contain"
    },
    demo_te:{
        fontSize:18,
        color:'#ffffff'
    }



});