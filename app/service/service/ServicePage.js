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
    ScrollView

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


export default class ServicePage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChoose1:true,
            isChoose2:false,
            isChoose3:false,
            isChoose4:false,
            isChoose5:false,
            num:1

        };
        this.isDemo=false;//是否是显示数据
        this._renderBody=this._renderBody.bind(this);
        this.setChoose=this.setChoose.bind(this);
        this._renderDemo=this._renderDemo.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: false, // 默认隐藏底部标签栏
    };

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

                <View style={styles.wrapper2}>
                    <TouchableWithoutFeedback onPress={()=>{this.setChoose(1)}} >
                    <Image style={styles.service_gray_bg} source={this.state.isChoose1 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                        <Text style={this.state.isChoose1 ?styles.te_white : styles.te_black}>
                            01
                        </Text>
                    </Image>
                    </TouchableWithoutFeedback>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose1?'#e13238':'#f0f0f0'}]}/>
                    <TouchableWithoutFeedback onPress={()=>{this.setChoose(2)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose2 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose2 ?styles.te_white : styles.te_black}>
                                02
                            </Text>
                        </Image>
                    </TouchableWithoutFeedback>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose2?'#e13238':'#f0f0f0'}]}/>
                    <TouchableWithoutFeedback onPress={()=>{this.setChoose(3)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose3 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose3 ?styles.te_white : styles.te_black}>
                                03
                            </Text>
                        </Image>
                    </TouchableWithoutFeedback>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose3?'#e13238':'#f0f0f0'}]}/>
                    <TouchableWithoutFeedback onPress={()=>{this.setChoose(4)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose4 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose4 ?styles.te_white : styles.te_black}>
                                04
                            </Text>
                        </Image>
                    </TouchableWithoutFeedback>
                    <View style={[styles.line,{width:54,borderBottomColor:this.state.isChoose4?'#e13238':'#f0f0f0'}]}/>
                    <TouchableWithoutFeedback onPress={()=>{this.setChoose(5)}} >
                        <Image style={styles.service_gray_bg} source={this.state.isChoose5 ?require('../../img/service_red_bg.png') : require('../../img/service_gray_bg.png')}>
                            <Text style={this.state.isChoose5 ?styles.te_white : styles.te_black}>
                                05
                            </Text>
                        </Image>
                    </TouchableWithoutFeedback>
                </View>
                {this._renderBody(this.state.num)}
            </ScrollView>
                {this._renderDemo(this.isDemo)}

            </View>

        )
    }

    setChoose(index){
        switch (index){
            case 1:
                this.setState({isChoose1:true,num:1,isChoose2:false,isChoose3:false,isChoose4:false,isChoose5:false});
                break;
            case 2:
                this.setState({isChoose1:false,num:2,isChoose2:true,isChoose3:false,isChoose4:false,isChoose5:false});
                break;
            case 3:
                this.setState({isChoose1:false,num:3,isChoose2:false,isChoose3:true,isChoose4:false,isChoose5:false});
                break;
            case 4:
                this.setState({isChoose1:false,num:4,isChoose2:false,isChoose3:false,isChoose4:true,isChoose5:false});
                break;
            case 5:
                this.setState({isChoose1:false,num:5,isChoose2:false,isChoose3:false,isChoose4:false,isChoose5:true});
                break;
        }
    }


    _renderBody(index){
        switch (index){
            case 1:
                return <CopyTaxes {...this.props}/>//抄税
                break;
            case 2:
                return <SendBill {...this.props} />//发送票据
                break;
            case 3:
                return <AccountingTreatment {...this.props} />//财务处理
                break;
            case 4:
                return <PayTaxes {...this.props} />//申报纳税
                break;
            case 5:
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
        width:SCREEN_WIDTH,
        justifyContent:'center',
        marginTop:30,
        alignItems:'center'

    },
    line:{
        height:1,
        width:SCREEN_WIDTH,
        borderBottomColor:'#e13238',
        borderBottomWidth:1 ,
        backgroundColor:'transparent'
    },
    service_gray_bg:{
        resizeMode : "contain",
        alignItems:'center',
        justifyContent:'center'
    },
    te_black:{
        fontSize:12,
        color:'#666666',
        alignItems:'center',
        backgroundColor:'transparent'
    },
    te_white:{
        fontSize:12,
        color:'#FFFFFF',
        alignItems:'center',
        backgroundColor:'transparent'

    },
    service_demo_img:{
        resizeMode : "contain"
    },
    demo_te:{
        fontSize:18,
        color:'#ffffff'
    }



});