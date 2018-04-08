/**
 * Created by jinglan on 2018/4/4.
 */

import React, {Component} from 'react';
import {
    View,
    DeviceEventEmitter,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Button,
    TouchableWithoutFeedback
} from 'react-native';
import px2dp from '../../util/index';

import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import SubmitButton from "../../view/SubmitButton";
import * as apis from '../../apis';
import Toast from 'react-native-root-toast';
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
            tableData: [
                ['1', '2', '3', '4'],
                ['a', '测试二行数据测试二行数据测试二行数据测试二行数据测试二行数据', 'c', 'd'],
                ['1', '2', '3', '456'],
                ['a', '测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据测试三行数据', 'c', 'd']
            ],

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

        let loading = SActivityIndicator.show(true, "载入中...");

        //companycode,date='',id
        apis.loadVoucherDetail(this.props.companyid,this.props.relatedate,this.props.id).then(
            (voucherInfo) => {
                SActivityIndicator.hide(loading);

                if (voucherInfo) {

                    console.log("============" + voucherInfo)
                    this.setState({
                        initStatus:'initSucess',
                    });

                } else {
                    this.setState({
                        initStatus:'no-data',
                        // initStatus:'initSucess', //接口调通后再改过来

                    });
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    initStatus:'error',
                    // initStatus:'initSucess',  //接口调通后再改过来

                });

            },
        );

    }


// {this.props.companyName}

// {this.state.company ? this.state.company.name : "测试"}


    render() {

        if (this.state.initStatus === 'initSucess') {
            return (
                <View style={{flex: 1, backgroundColor: '#fafafa',alignItems:'center'}}>


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
                        <Text style={[{marginLeft:23,marginTop:8,marginBottom:8}]}>{"测试1"}</Text>
                        <Text style={[{marginRight:23,marginTop:8,marginBottom:8}]}>{"测试2"}</Text>

                    </View>


                    <View style={{width:SCREEN_WIDTH, backgroundColor:"#FFFFFF"}}>
                        <Table style={styles.tableStyle} borderStyle={{ borderWidth:1,borderColor: '#D1D1D1'}}>
                            <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.headStyle} textStyle={styles.headText}/>
                            <Rows data={this.state.tableData} widthArr={this.state.widthArr} style={styles.rowStyle} textStyle={styles.text}/>
                        </Table>
                    </View>


                </View>
            )
        } else {
            return (
                <DefaultView onPress={()=>this._loadData()} type={this.state.initStatus}/>
            )
        }
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