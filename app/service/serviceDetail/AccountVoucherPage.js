/**
 * Created by jinglan on 2018/4/4.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
import {formatmoney} from '../../util/FormatMoney';

import BComponent from '../../base/BComponent'
export default class AccountVoucherPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            companyName : this.props.companyName,
            dataDetail : this.props.dataDetail,
            relatedate : this.props.relatedate,

            tableHead: ['摘要', '会计科目', '借方金融', '贷方金额'],
            tableData: [],
            voucherWord:'',
            accountName:'',
            auditName:'',
            creatName:'',
            isLoading:false,
            widthArr: [ 83.0 / (375 - 30 ) * (SCREEN_WIDTH - 30), 94.0 / (375 - 30 ) * (SCREEN_WIDTH - 30) , 86.0 / (375 - 30 ) * (SCREEN_WIDTH - 30), 86.0 / (375 - 30 ) * (SCREEN_WIDTH - 30)],
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据

        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));


    }
    componentDidMount() {
         this._loadData()
    }

    _loadData(){
        let arr = [];
        let voucherInfo = this.props.dataDetail;

        let subjectDetails = voucherInfo.subjectDetails;

        let allDebitMoney = 0.00;  //借方
        let allcreditorMoney = 0.00; //贷方

        for(let i=0;i<subjectDetails.length;i++){
            let dic = subjectDetails[i];

            allDebitMoney += dic.debitMoney;
            allcreditorMoney += dic.creditorMoney;

            let debitMoneyM = formatmoney(dic.debitMoney + 0.0);
            let creditorMoneyM = formatmoney(dic.creditorMoney + 0.0);

            arr.push([dic.subject_Abstract,dic.subjectName,debitMoneyM,creditorMoneyM])
        }


        if (arr.length > 0){
            let debtorCountM = formatmoney(allDebitMoney);
            let creditorCountM = formatmoney(allcreditorMoney);

            arr.push(["合计","会计科目",debtorCountM,creditorCountM])
        }


        this.setState({
            tableData:arr,
            voucherWord:voucherInfo.voucherWord,
            accountName:voucherInfo.accountName,
            auditName:voucherInfo.auditName,
            creatName:voucherInfo.creatName,

        });

    }

    render() {

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ScrollView >

                    <View style={[{height:46,width:SCREEN_WIDTH,justifyContent:'center',alignItems:'center',backgroundColor:"#FFFFFF"}] }>

                        <Text
                            numberOfLines={0}

                            style={[{fontSize: 18,
                                marginLeft : 10 ,color : '#333333'}] }>
                            {this.props.companyName}
                        </Text>
                    </View>


                    <View style={[{height:0.5,width:SCREEN_WIDTH,backgroundColor:"#D1D1D1"}]}>
                    </View>



                    <View style={[{width:SCREEN_WIDTH ,justifyContent:"space-between",flexDirection:"row",backgroundColor:"#FFFFFF"}]}>
                        <Text style={[{marginLeft:23,marginTop:8,marginBottom:8}]}>{this.state.voucherWord}</Text>
                        <Text style={[{marginRight:23,marginTop:8,marginBottom:8}]}>{this.state.relatedate}</Text>

                    </View>


                    <View style={{width:SCREEN_WIDTH, backgroundColor:"#FFFFFF"}}>
                        <Table style={styles.tableStyle} borderStyle={{ borderWidth:1,borderColor: '#D1D1D1'}}>
                            <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.headStyle} textStyle={styles.headText}/>
                            <Rows data={this.state.tableData} widthArr={this.state.widthArr} style={styles.rowStyle} textStyle={styles.text}/>
                        </Table>
                    </View>

                    <View style={[{width:SCREEN_WIDTH ,flexDirection:"column",backgroundColor:"#FFFFFF",paddingLeft:15}]}>
                        <Text style={{fontSize:12,color:'#333333'}}>会计主管:{this.state.accountName}</Text>
                        <Text style={{fontSize:12,color:'#333333',paddingTop:8}}>审核人:{this.state.auditName}</Text>
                        <Text style={{fontSize:12,color:'#333333',paddingTop:8,paddingBottom:10}}>制单人:{this.state.creatName}</Text>
                    </View>


                </ScrollView>
                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop:10,
        paddingBottom:15
    },


    tableStyle: {marginBottom:10,width:SCREEN_WIDTH - 20, marginLeft:10,marginRight:10},

    headStyle: { height: 36, backgroundColor: '#E7E7E7' },
    rowStyle: { backgroundColor: '#FFFFFF',minHeight:50 },
    headText: { fontSize:14,color:"#333333",textAlign: 'center' },
    text: { fontSize:12,color:"#666666",textAlign: 'center',marginTop:10,marginBottom:10 }
});