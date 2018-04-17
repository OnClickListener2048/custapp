/**
 * Created by jinglan on 2018/4/4.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import ImageLoad from "../../view/ImageLoad";

import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
import {formatmoney} from '../../util/FormatMoney';

import BComponent from '../../base/BComponent'
export default class AccountVoucherPage extends BComponent {

    constructor(props) {
        super(props);
        this.state = {
            companyName : this.props.companyName,
            relatedate : '',

            tableHead: ['摘要', '会计科目', '借方金融', '贷方金额'],
            tableData: [],
            allCountData: [], //合计
            imageArr:[],
            voucherWord:'',
            accountName:'',
            auditName:'',
            creatName:'',
            isLoading:false,
            widthArr: [ 83.0 / (375 - 30 ) * (SCREEN_WIDTH - 30) - 1, 94.0 / (375 - 30 ) * (SCREEN_WIDTH - 30) - 1,
                        86.0 / (375 - 30 ) * (SCREEN_WIDTH - 30) - 1, 86.0 / (375 - 30 ) * (SCREEN_WIDTH - 30) - 1.5],
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

        let allCountArr = [];
        let debtorCountM = formatmoney(allDebitMoney);
        let creditorCountM = formatmoney(allcreditorMoney);

        allCountArr.push(["合计","会计科目",debtorCountM,creditorCountM])


        this.setState({
            tableData:arr,
            allCountData: allCountArr,
            voucherWord:voucherInfo.voucherWord,
            accountName:voucherInfo.accountName,
            auditName:voucherInfo.auditName,
            creatName:voucherInfo.creatName,
            isLoading:true

        });
        apis.loadVoucherDetail(this.props.companyid,this.props.relatedate,this.props.id).then(
            (voucherInfo) => {
                if (voucherInfo) {

                    let arr = [];
                    let imageArr = [];
                    let subjectDetails = voucherInfo.data.subjectDetails
                    for(let i=0;i<subjectDetails.length;i++){
                        let dic = subjectDetails[i];
                        arr.push([dic.subject_Abstract,dic.subjectName,dic.debitMoney,dic.creditorMoney])

                        for(let j=0;j<dic.receiptDetails.length;j++){
                            let imgObj = dic.receiptDetails[j]
                            imageArr.push(imgObj)
                        }
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
                    this.setState({
                        tableData:arr,
                        voucherWord:voucherInfo.data.voucherWord,
                        accountName:voucherInfo.data.accountName,
                        auditName:voucherInfo.data.auditName,
                        creatName:voucherInfo.data.creatName,
                        imageArr:imageArr,
                        isLoading:false

                    });

                }else{
                    this.setState({
                        isLoading:false
                    })
                }
            },
            (e) => {
                this.setState({
                    isLoading:false
                })
            },
        );

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


                        <View style={{width:SCREEN_WIDTH, backgroundColor:"#FFFFFF",alignItems:'center'}}>
                            <Table style={styles.tableStyle} borderStyle={{ borderWidth:1,borderColor: '#D1D1D1'}}>
                                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.headStyle} textStyle={styles.headText}/>
                                <Rows data={this.state.tableData} widthArr={this.state.widthArr} style={styles.rowStyle} textStyle={styles.text}/>
                                {
                                    this.state.allCountData.map((rowData, index) => (
                                        <TableWrapper key={index} style={styles.allCountRowStyle}>
                                            {
                                                rowData.map((cellData, cellIndex) => (
                                                    <Cell key={cellIndex} data={cellData} style={{width:this.state.widthArr[cellIndex]}} textStyle={cellIndex === 0 ? styles.allCountText : styles.text}/>
                                                ))
                                            }
                                        </TableWrapper>
                                    ))
                                }
                            </Table>
                        </View>

                        <View style={[{width:SCREEN_WIDTH ,flexDirection:"column",backgroundColor:"#FFFFFF",paddingLeft:15}]}>
                            <View style={styles.tableCellStyle}>
                                <Text style={{fontSize:12,color:'#333333'}}>会计主管:{this.state.accountName}</Text>
                            </View>
                            <View style={styles.tableCellStyle}>
                                <Text style={styles.tableCellTextStyle}>审核人:{this.state.auditName}</Text>
                            </View>
                            <View style={styles.tableCellStyle}>
                                <Text style={styles.tableCellTextStyle}>制单人:{this.state.creatName}</Text>
                            </View>
                            {
                                this.state.imageArr.length>0?<View style={styles.tableCellStyle}>
                                    <Text style={styles.tableCellTextStyle}>票据:{this.state.imageArr.length}张</Text>
                                </View>:null
                            }
                        </View>
                        <View style={{width:SCREEN_WIDTH,flexDirection:'row',flexWrap:'wrap',backgroundColor:"#FFFFFF",paddingBottom:15}}>
                            {
                                this.state.imageArr.map((item,index)=>{
                                    let width =(SCREEN_WIDTH-45)/2;
                                    let height = width * 0.6;
                                    if(item.rotate / 90 %2 == 1){
                                        //90 270
                                        height = (SCREEN_WIDTH-45)/2
                                        width = height*0.6

                                    }
                                    let rotate = item.rotate+'deg'
                                    return(
                                        <TouchableOpacity key = {index} onPress = {this._showPhotoModel.bind(this,item,index)}>
                                            <View style={{width:(SCREEN_WIDTH-45)/2,height:(SCREEN_WIDTH-45)*0.6/2,marginLeft:15,marginTop:15,justifyContent:'center',alignItems:'center'}}>
                                                <ImageLoad
                                                    style={{width:width,height:height,transform:[{rotate:rotate}]}}                                                resizeMode="contain"
                                                    loadingStyle={{size: 'small', color: 'black'}}
                                                    source={{uri:item.receiptPath}}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
               </ScrollView>

                <PLPActivityIndicator isShow={this.state.isLoading} />
            </View>
        )
    }
    _showPhotoModel(item,index){

        this.props.navigator.push({
            screen: 'ShowPhotoPage',
            title:'查看图片',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps: {
                imageArr:this.state.imageArr,
                index:index
            }
        });
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

    tableCellStyle:{paddingTop:12,paddingBottom:12,borderBottomWidth:0.5,borderBottomColor:'#D1D1D1'},

    tableCellTextStyle:{fontSize:12,color:'#333333'},

    tableStyle: {marginBottom:10,width:SCREEN_WIDTH - 30,backgroundColor:"#ffffff"},

    headStyle: { height: 36, backgroundColor: '#E7E7E7' },
    rowStyle: { backgroundColor: '#FFFFFF',minHeight:50 },
    headText: { fontSize:14,color:"#333333",textAlign: 'center' },
    text: { fontSize:12,color:"#666666",textAlign: 'center',marginTop:10,marginBottom:10 },

    allCountText: { fontSize:14,color:"#333333",textAlign: 'center' },
    allCountRowStyle: {backgroundColor: '#FFFFFF',minHeight:36,flexDirection:"row"},

});