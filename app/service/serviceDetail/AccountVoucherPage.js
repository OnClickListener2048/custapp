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
                ['a', 'b', 'c', 'd'],
                ['1', '2', '3', '456'],
                ['a', 'b', 'c', 'd']
            ],



            dataSource:[],
            isShowButton:false,
            userMobile:'',
            initStatus:'', //loading 加载中;  no-net 无网; error 初始化失败; no-data 初始请求数据成功但列表数据为空 ;initSucess 初始化成功并且有数据
            selectedCompanyId:'2'
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
        // this._loadData()
    }


    _loadData(){

        if(!NetInfoSingleton.isConnected) {
            this.setState({
                initStatus:'no-net'
            });
            return;
        }


        let loading = SActivityIndicator.show(true, "载入中...");


        apis.getCompany(this.state.userMobile).then(
            (companyInfo) => {
                SActivityIndicator.hide(loading);

                if (companyInfo && companyInfo.list) {



                } else {

                    this.setState({
                        initStatus:'no-data',
                    });
                }
            },
            (e) => {
                SActivityIndicator.hide(loading);
                this.setState({
                    initStatus:'error',
                });

            },
        );
    }


// {this.props.companyName}


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fafafa',alignItems:'center'}}>


                <View style={[{height:46,width:SCREEN_WIDTH,justifyContent:'center',alignItems:'center',backgroundColor:"#FFFFFF"}] }>

                    <Text
                        numberOfLines={0}

                        style={[{fontSize: 18,
                            marginLeft : 10 ,color : '#333333'}] }>
                    </Text>
                </View>
                <View style={[{height:0.5,width:SCREEN_WIDTH,backgroundColor:"#D1D1D1"}] }>
                </View>

                <View style={{width:SCREEN_WIDTH, backgroundColor:"#FFFFFF"}}>

                    <Table style={{marginTop:20,marginBottom:20,width:SCREEN_WIDTH - 20, marginLeft:10}} borderStyle={{ borderWidth:1,borderColor: '#D1D1D1'}}>
                        <Row data={this.state.tableHead} style={styles.headStyle} textStyle={styles.headText}/>
                        <Rows data={this.state.tableData} style={styles.rowStyle} textStyle={styles.text}/>
                    </Table>
                </View>


            </View>
        )
        // if (this.state.initStatus === 'initSucess') {
        //     return (
        //             <View style={{flex: 1, backgroundColor: '#fafafa'}}>
        //
        //                 <Text
        //                     numberOfLines={0}
        //
        //                     style={[{fontSize: 18,lineHeight: 20,height:46,width:SCREEN_WIDTH - 20,
        //                         marginLeft : 10 ,color : '#333333',backgroundColor:"orange"}] }>
        //                     呵呵哒
        //                 </Text>
        //
        //                 <ScrollView style={{
        //                     width: SCREEN_WIDTH,
        //                     height: this.state.isShowButton === true ? SCREEN_HEIGHT - 50 - 40 : SCREEN_HEIGHT,
        //                     backgroundColor: '#fafafa'
        //                 }}>
        //
        //                 </ScrollView>
        //
        //                 {this.state.isShowButton === true &&
        //                 <SubmitButton onPress={this._goFee}
        //                               isEnabled={true}
        //
        //                               text="我要续费"
        //                 />}
        //                 {this.state.isShowButton === true &&
        //
        //                 <View style={{
        //                     justifyContent: 'center',
        //                     alignItems: 'center',
        //                     backgroundColor: '#fafafa',
        //                     height: 20
        //                 }}/>}
        //
        //
        //             </View>
        //     )
        // } else {
        //     return (
        //         <DefaultView onPress={()=>this._loadData()} type={this.state.initStatus}/>
        //     )
        // }
    }

}


const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        //height: Dimensions.get('window').height * 0.3,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingTop:10,
        paddingBottom:15
    },

    headStyle: { height: 50, backgroundColor: '#E7E7E7' },
    rowStyle: { height: 50, backgroundColor: '#FFFFFF' },


    headText: { fontSize:14,color:"#333333",textAlign: 'center' },

    text: { fontSize:12,color:"#666666",textAlign: 'center' }
});