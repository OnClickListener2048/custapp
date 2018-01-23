/**
 * Created by zhuangzihao on 2018/1/23.
 */


import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image

} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import BComponent from '../../base'
import invoice_data from './invoice_data.json'
import * as apis from '../../apis';
export default class InvoiceInfoPage extends BComponent {

    constructor(props){
        super(props)

    }
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    //开始扫描
    componentDidMount() {
        // let params = {
        //     FPDM:this.props.codeInputValue,//arr[2]发票代码
        //     FPHM:this.props.numberInputValue,//arr[3]发票号码
        //     KPRQ:this.props.dateTime,//arr[5]日期
        //     FPLX:this.props.invoiceType,//arr[1]发票类型
        // }
        // if(this.props.amount){
        //     params.FPJE = this.props.amount
        // }
        // if(this.props.checkCodeInputValue){
        //     params.JYM = this.props.checkCodeInputValue
        // }

        //const res = {result:"01,10,011001600211,25236205,33.96,20170701,70438474151372413936,AD3C,"};
        let params = {
            FPDM:'011001600211',//arr[2]发票代码
            FPHM:'25236205',//arr[3]发票号码
            KPRQ:'20170701',//arr[5]日期
            FPLX:'10',//arr[1]发票类型
            FPJE:'33.96',//arr[4]发票金额
            JYM:'413936'//arr[6]校验码后六位
        }
        apis.verifyInvoice('2',params).then((responseData)=>{

            console.log('success:',responseData)

        },(e)=>{
            console.log('error',e)

        })
    }


    render(){
        return(
            <View>

            </View>
        )
    }
}







