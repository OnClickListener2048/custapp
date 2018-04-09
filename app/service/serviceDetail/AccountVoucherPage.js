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
            id : this.props.id,
            companyid : this.props.companyid,
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
        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            });
            return;
        }
        this.setState({
            isLoading:true
        })
        apis.loadVoucherDetail(this.props.companyid,this.props.relatedate,this.props.id).then(
            (voucherInfo) => {
                if (voucherInfo) {

                    console.log("============" + voucherInfo)

                    let arr = [];
                    let subjectDetails = voucherInfo.data.subjectDetails
                    for(let i=0;i<subjectDetails.length;i++){
                        let dic = subjectDetails[i];
                        arr.push([dic.subject_Abstract,dic.subjectName,dic.debitMoney,dic.creditorMoney])
                    }

                    let debtorCount = 0.00;  //借方
                    let creditorCount = 0.00; //贷方
                    for (let i = 0 ; i < arr.count ; i++){
                        let secArr = arr[i];
                        if (secArr.length > 3){
                            debtorCount += secArr[2];
                            creditorCount += secArr[3];
                        }
                    }

                    if (arr.length > 0){
                        let debtorCountM = formatmoney(debtorCount);
                        let creditorCountM = formatmoney(creditorCount);

                        arr.push(["合计","会计科目",debtorCountM,creditorCountM])
                    }

                    // // let arr = [["付员工工资","应付职工薪酬_职工薪资","9000","0"],["付员工工资","库存现金","0","9000"]];
                    //
                    // let arr = [
                    //     ['1', '2', '3', '4'],
                    //     ['a', '测试二行数据测试二行数据测试二行数据测试二行数据测试二行数据', 'c', 'd'],
                    //     ['1', '2', '3', '456'],
                    //     ['a', '测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据', 'c', 'd']
                    // ];


                    console.log("============arr" + arr)

                    this.setState({
                        initStatus:'initSucess',
                        tableData:arr,
                        voucherWord:voucherInfo.data.voucherWord,
                        accountName:voucherInfo.data.accountName,
                        auditName:voucherInfo.data.auditName,
                        creatName:voucherInfo.data.creatName,
                        isLoading:false

                    });

                } else {
                    this.setState({
                        initStatus:'no-data',
                        isLoading:false

                    });
                }
            },
            (e) => {
                this.setState({
                    initStatus:'error',
                    isLoading:false

                });

            },
        );

    }

    render() {

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                {this.state.initStatus == 'initSucess'?<ScrollView >

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


                </ScrollView>:<DefaultView onPress={()=>this._loadData()} type={this.state.initStatus}/>}
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

    headStyle: { height: 50, backgroundColor: '#E7E7E7' },
    rowStyle: { backgroundColor: '#FFFFFF',minHeight:50 },
    headText: { fontSize:14,color:"#333333",textAlign: 'center' },
    text: { fontSize:12,color:"#666666",textAlign: 'center',marginTop:10,marginBottom:10 }
});