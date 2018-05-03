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
    Platform,
    Image
} from 'react-native';

import {SCREEN_HEIGHT,SCREEN_WIDTH,PRIMARY_YELLOW} from '../../config';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import ImageLoad from "../../view/ImageLoad";

import * as apis from '../../apis';
import DefaultView from '../../view/DefaultView'
import {formatmoney} from '../../util/FormatMoney';

import BComponent from '../../base/BComponent';
import {exportFile} from '../../util/XlsxTool';
import Modal from '../../view/Modalbox';

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
            xslxData:[],//分享的表格数据
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));


    }
    componentDidMount() {
         this._loadData()
    }
    _loadData(){

        
        this.setState({
            isLoading:true

        })
        apis.loadVoucherDetail(this.props.companyid,this.props.relatedate,this.props.id).then(
            (voucherInfo) => {
                if (voucherInfo) {
                    let xslxData = [this.state.tableHead];
                    let arr = [];
                    let imageArr = [];

                    let subjectDetails =  voucherInfo.data.subjectDetails;

                    let allDebitMoney = 0.00;  //借方
                    let allcreditorMoney = 0.00; //贷方

                    for(let i=0;i<subjectDetails.length;i++){
                        let dic = subjectDetails[i];

                        allDebitMoney += dic.debitMoney;
                        allcreditorMoney += dic.creditorMoney;

                        let debitMoneyM = formatmoney(dic.debitMoney + 0.0);
                        let creditorMoneyM = formatmoney(dic.creditorMoney + 0.0);

                        arr.push([dic.subject_Abstract,dic.subjectName,debitMoneyM,creditorMoneyM])
                        xslxData.push([dic.subject_Abstract,dic.subjectName,debitMoneyM,creditorMoneyM])
                        for(let j=0;j<dic.receiptDetails.length;j++){
                            let imgObj = dic.receiptDetails[j]
                            imageArr.push(imgObj)
                        }
                    }

                    let allCountArr = [];
                    let debtorCountM = formatmoney(allDebitMoney);
                    let creditorCountM = formatmoney(allcreditorMoney);

                    allCountArr.push(["合计","会计科目",debtorCountM,creditorCountM])
                    xslxData.push(["合计","会计科目",debtorCountM,creditorCountM])

                    this.setState({
                        tableData:arr,
                        allCountData: allCountArr,
                        voucherWord:voucherInfo.data.voucherWord,
                        accountName:voucherInfo.data.accountName,
                        auditName:voucherInfo.data.auditName,
                        creatName:voucherInfo.data.creatName,
                        isLoading:false,
                        imageArr:this._unique(imageArr),
                        xslxData:xslxData
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
    _unique(imgs){
        let result = {};
        let finalResult=[];
        for(let i=0;i<imgs.length;i++){
            result[imgs[i].receiptId]=imgs[i];
        }

        for(item in result){
            finalResult.push(result[item]);
        }
        return finalResult;
    }

    componentWillMount() {

        this.initNavigatorBar();

    }

    initNavigatorBar(){
        if(Platform.OS === 'ios') {
            UserInfoStore.getMobileLoginInfo().then(
                v => {
                    if(v && v.open) {
                        this.props.navigator.setButtons({
                            rightButtons: [], // see "Adding buttons to the navigator" below for format (optional)
                        });
                    } else {
                        this.props.navigator.setButtons({
                            rightButtons: [{icon: require('../../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
                        });
                    }
                }, e => {
                    this.props.navigator.setButtons({
                        rightButtons: [{icon: require('../../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
                    });
                }
            );
        } else {
            // Android一直打开微信登录
            this.props.navigator.setButtons({
                rightButtons: [{icon: require('../../img/share.png'),id:'share'}], // see "Adding buttons to the navigator" below for format (optional)
            });
        }
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        super.onNavigatorEvent(event)
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'share') { // this is the same id field from the static navigatorButtons definition
                this.refs.shareModel.open()
            }
        }
    }

    _shareToWeXin(){
        exportFile(this.state.xslxData,this.state.companyName,[{wpx: DeviceInfo.width/7*3},{wpx: DeviceInfo.width/7*3}, {wpx: DeviceInfo.width/7}, {wpx: DeviceInfo.width/7}])

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


                                {
                                    this.state.tableData.map((rowData, index) => (
                                        <TableWrapper key={index} style={styles.allCountRowStyle}>
                                            {
                                                rowData.map((cellData, cellIndex) => (
                                                    <Cell key={cellIndex} data={cellData} style={{width:this.state.widthArr[cellIndex]}} textStyle={cellIndex < 2 ? styles.cellLeftRowText : styles.cellRowText}/>
                                                ))
                                            }
                                        </TableWrapper>
                                    ))
                                }


                                {
                                    this.state.allCountData.map((rowData, index) => (
                                        <TableWrapper key={index} style={styles.allCountRowStyle}>
                                            {
                                                rowData.map((cellData, cellIndex) => (
                                                    <Cell key={cellIndex} data={cellData} style={{width:this.state.widthArr[cellIndex]}} textStyle={cellIndex === 0 ? styles.allCountText : cellIndex === 1 ? styles.cellLeftRowText : styles.cellRowText}/>
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
                <Modal style={{height:187,backgroundColor:'#EDEDED'}} position={"bottom"} ref={"shareModel"}>
                    <Text style={{fontSize:18,padding:16,textAlign:'center',color:'#666666'}}>分享</Text>
                    <View style={{paddingLeft:70,paddingRight:70,flex:1,justifyContent:'space-around', alignItems:'center',flexDirection:'row',borderTopWidth:1,borderTopColor:'#E1E1E1'}}>
                        <TouchableOpacity onPress={()=>{this._shareToWeXin()}}>
                            <View style={{alignItems:'center'}}>
                                <Image source={require('../../img/share_friend.png')}/>
                                <Text style={{fontSize:12,marginTop:8,color:'#666666'}}>微信好友</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
    rowStyle: { backgroundColor: '#FFFFFF',minHeight:50},
    headText: { fontSize:14,color:"#333333",textAlign: 'center' },
    cellRowText: { fontSize:12,color:"#666666",textAlign: 'right',marginTop:10,marginBottom:10 ,marginRight:6 },
    cellLeftRowText: { fontSize:12,color:"#666666",textAlign: 'left',marginTop:10,marginBottom:10 ,marginLeft:6 },

    allCountText: { fontSize:14,color:"#333333",textAlign: 'left' ,marginLeft:6},
    allCountRowStyle: {backgroundColor: '#FFFFFF',minHeight:36,flexDirection:"row"},

});