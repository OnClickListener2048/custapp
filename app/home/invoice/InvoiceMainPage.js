/**
 * Created by liufei on 2018/1/22.
 */


import SubmitButtonWithIcon from "../../view/SubmitButtonWithIcon";
import SubmitButton from "../../view/SubmitButton";
import * as apis from '../../apis';
import Alert from "react-native-alert";

import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import BComponent from '../../base'
export default class InvoiceMainPage extends BComponent {

    constructor(props){
        super(props)
        this.scan=this.scan.bind(this);
        this.check=this.check.bind(this);
    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };

    //错误信息提示框
    _AlertErrorMsg(content){
        Alert.alert(content, '', [
            {
                text: "确定",
                onPress: () => console.log('Cancel Pressed'),
                color: "#ef0c35", // 可选, 可以不设置
                style: 'cancel',
            }]);
    }

    //开始扫描
    scan(){
        let _this = this
        this.push({
            title: '扫一扫',
            screen: 'QRCodeScreenPage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                callback:function (data) {
                    // alert(JSON.stringify(data))
                    const arr=data.data.split(",");
                    let params = {
                        FPDM:arr[2],//arr[2]发票代码
                        FPHM:arr[3],//arr[3]发票号码
                        KPRQ:arr[5],//arr[5]日期
                        FPLX:arr[1],//arr[1]发票类型
                    }
                    if(arr[4]){
                        params.FPJE = arr[4]//arr[4]发票金额
                    }
                    if(arr[6]){
                        params.JYM = arr[6]>6?arr[6].substring(arr[6].length-6,arr[6].length):arr[6]//arr[6]校验码后六位
                    }
                    apis.verifyInvoice('1',params).then((responseData)=>{

                        console.log('success:',responseData)
                        if (responseData.data !== null && responseData.data !== undefined && responseData.data !== '') {//直接进入详情true
                            _this.push({
                                title: '发票信息',
                                screen: 'InvoiceInfoPage',
                                backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                                passProps:{
                                    status:false,
                                    codeInputValue:arr[2],
                                    numberInputValue:arr[3],
                                    checkCodeInputValue:(arr[6] > 6 ? arr[6].substring(arr[6].length - 6, arr[6].length) : arr[6]),
                                    dateTime:arr[5],
                                    invoiceType:arr[1],
                                    amount:arr[4],
                                    step:1,
                                }
                            });
                        } else {//进入校验页面
                            //解析，读取展示二维码信息
                            const arr = responseData.split(",");
                            const dataTime = arr[5];

                            function formatTime(date) {
                                var year = date.getFullYear()
                                var month = date.getMonth() + 1
                                var day = date.getDate()
                                return [year, month, day].map(formatNumber).join('')
                            }

                            function formatNumber(n) {
                                n = n.toString()
                                return n[1] ? n : '0' + n
                            }

                            const nowData = formatTime(new Date());
//                                          console.log("==="+arr.length+","+dataTime+","+nowData+","+arr[0].length+","+(parseInt(nowData)-parseInt(dataTime)));
                            if (arr[0].length !== 2 || arr[1].length !== 2 || (arr[2].length !== 10 && arr[2].length !== 12) || arr[3].length !== 8) {//扫描的二维码有误
                                this._AlertErrorMsg('扫描的二维码有误');
                            } else if (arr[1] !== '01' && arr[1] !== '02' && arr[1] !== '03' && arr[1] !== '04' && arr[1] !== '10' && arr[1] !== '11') {
                                this._AlertErrorMsg('此发票不在查询范围');
                            } else if (dataTime === nowData) {//当日发票次日可查验
                                this._AlertErrorMsg('当日发票次日可查验');
                            } else if (parseInt(nowData) - parseInt(dataTime) > 10000) {//只支持一年内发票查验
                                this._AlertErrorMsg('只支持一年内发票查验');
                            } else {
                                _this.push({
                                    title: '发票验真',
                                    screen: 'InvoiceInputPage',
                                    backButtonHidden: true, // 是否隐藏返回按钮 (可选)
                                    passProps:{
                                        result:data.data
                                    }
                                });
                            }
                        }

                    },(e)=>{
                        console.log('error',e)


                    })
                }
            }
        });
    }

    //手工录入查验
    check(){
        this.push({
            title: '发票验真',
            screen: 'InvoiceInputPage',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
            }
        });
    }

    render(){
        return(
            <View>
                <View style={{alignItems:'center'}}>
                    <Image
                        source={require('../../img/invoice_home_icon.png')}
                        style={{marginTop:50,}}
                    />
                    <Text style={{fontSize:18,color:'#333333',marginTop:30}}>
                        扫描二维码查验
                    </Text>
                </View>



                <View style={{marginTop:50}}>
                    <SubmitButtonWithIcon
                        isEnabled={true}
                        text="开始扫描"
                        img={require('../../img/scan_icon.png')}
                        buttonStyle={{width:SCREEN_WIDTH-40}}
                        textStyle={{ marginLeft: 10}}
                        onPress={() => {
                            this.scan()
                        }}
                    />
                    <SubmitButton
                        isEnabled={false}
                        text="手工录入查验"
                        buttonStyle={{width:335}}
                        onPress={() => {
                            this.check()
                        }}

                    />
                </View>
            </View>
        )
    }
}







