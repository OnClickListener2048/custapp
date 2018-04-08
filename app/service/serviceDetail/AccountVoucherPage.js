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



        UserInfoStore.getCompany().then(
            (company) => {
                if (company && company.infos && company.infos.length>0) {
                    this.setState({
                        selectedCompanyId: company.id,
                        company : company
                    });
                }
            },
            (e) => {
                console.log("读取信息错误:", e);
            },
        );

    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        // console.log('ApplicationCenterPage event.type', event.type);
        //console.log('ApplicationCenterPage event.type', event.id);
        super.onNavigatorEvent(event)
        if (event.id === 'willAppear') {


        }
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
        //companycode,date='',id
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
                        // initStatus:'initSucess', //接口调通后再改过来

                    });
                }
            },
            (e) => {
                this.setState({
                    initStatus:'error',
                    isLoading:false
                    // initStatus:'initSucess',  //接口调通后再改过来

                });

            },
        );

    }


// {this.props.companyName}

// {this.state.company ? this.state.company.name : "测试"}


    render() {

        return(
            <View style={{flex:1,backgroundColor:'#FFFFFF'}}>
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
                        <Text style={{fontSize:12,color:'#333333'}} >会计主管:{this.state.accountName}</Text>
                        <Text style={{fontSize:12,color:'#333333',marginTop:8}}  >审核人:{this.state.auditName}</Text>
                        <Text style={{fontSize:12,color:'#333333',marginTop:8}}  >制单人:{this.state.creatName}</Text>
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


    tableStyle: {marginBottom:20,width:SCREEN_WIDTH - 20, marginLeft:10},

    headStyle: { height: 50, backgroundColor: '#E7E7E7' },
    rowStyle: { backgroundColor: '#FFFFFF',minHeight:50 },
    headText: { fontSize:14,color:"#333333",textAlign: 'center' },
    text: { fontSize:12,color:"#666666",textAlign: 'center',marginTop:10,marginBottom:10 }
});