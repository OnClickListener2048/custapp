/**
 * Created by zhuangzihao on 2018/1/23.
 */


import React, {Component,PropTypes} from 'react';
import {

    StyleSheet,
    Text,
    View,
    Image,
    SectionList,
    TouchableOpacity
} from 'react-native';
import {SCREEN_HEIGHT,SCREEN_WIDTH} from '../../config';
import BComponent from '../../base'
import invoice_data from './invoice_data.json'
import ExpanableList from '../../view/ExpanableList'
import SectionHeader from '../../view/SectionHeader'
import CheckInfoItemTwo from '../../view/CheckInfoItemTwo'
import CheckInfoItemFour from '../../view/CheckInfoItemFour'
import * as apis from '../../apis';
import util from "../../util/invoiceTool"

import Alert from "react-native-alert";

export default class InvoiceInfoPage extends BComponent {

    constructor(props){
        super(props)
        this.state = {
            dataSource:[],
            goodsList:[],

        };
    }
    static defaultProps = {
        codeInputValue:'',
        numberInputValue:'',
        dateTime:'',
        invoiceType:'',
        amount:'',
        checkCodeInputValue:'',
        data:'',
        msg:''
    };
    static navigatorStyle = {
        navBarHidden: false, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    _callback = () =>{
        let _this = this

        this.dealIsSaved(this.props.invoiceType,this.props.data,this.dealInvoiceData(this.props.invoiceType,this.props.data),function (arr) {
            _this.setState({
                dataSource:arr,
                goodsList:_this.props.data.CHILDLIST?_this.dealGoodsData(_this.props.data.CHILDLIST):[]
            })
        })
    }
    //开始扫描
    componentDidMount() {
            if(this.props.data){
                console.log("传值成功="+this.props.data);
                let _this = this

                this.dealIsSaved(this.props.invoiceType,this.props.data,this.dealInvoiceData(this.props.invoiceType,this.props.data),function (arr) {
                    _this.setState({
                        dataSource:arr,
                        goodsList:_this.props.data.CHILDLIST?_this.dealGoodsData(_this.props.data.CHILDLIST):[]
                    })
                })
            }else{
                let msg = this.props.msg?this.props.msg:'识别失败'
                Alert.alert(msg, '',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                if (this.props.navigator) {
                                    this.props.navigator.pop();
                                }
                            },
                        },]
                    , {cancelable: false});
            }
    }
    dealGoodsData(data){
        let newData = []
        for(let i = 0;i<data.length;i++){
            let dic = data[i]
            let newDic = {}
            for(let key  in dic){
                if((typeof dic[key]=='string')&&dic[key].constructor==String){
                    newDic[key] = dic[key].replace(/(^\s*)|(\s*$)/g, "")
                    if(parseFloat(newDic[key])){
                        newDic[key] = parseFloat(newDic[key]).toFixed(2).toString()
                    }

                }else{
                    newDic[key] = dic[key]
                }
            }
            newData.push(newDic)
        }
        return newData
    }
    dealInvoiceData(type,data){

        let newData = [];
        //映射字典
        let Map = invoice_data[type]['base']
        //组数组
        let section = invoice_data[type]['section']
        //循环组数组
        for(let i = 0;i<section.length;i++){
            //创建新的组对象
            let sectionDic = {};
            //组标题
            sectionDic.key = section[i]['sectionTitle'];
            sectionDic.isCoverGoods = section[i]['isCoverGoods']
            sectionDic.isSaved = section[i]['isSaved']
            sectionDic.isShowSaveStatus = section[i]['isShowSaveStatus']

            //创建组的行数组
            let rowArr = []
            //循环
            for(let j = 0;j<section[i]['arr'].length;j++){
                let rowDic = {}
                let key = section[i]['arr'][j]
                rowDic.key = Map[key]
                rowDic.value =''
                if(data[key]){
                    rowDic.value = data[key].replace(/(^\s*)|(\s*$)/g, "")
                    if(key === 'ZZSSL'){//增值税税率或征收率+%
                        rowDic.value = data[key]+'%'
                    }
                    if(key === 'KPRQ'){//日期格式化
                        //格式化日期
                        for(var h=0;h<data[key].length;h++){
                            var str = data[key].split('');
                            for (var h = 0; h < str.length; h++){
                                if(h===3||h===5)
                                    str[h] += '-';
                            }
                        }
                        rowDic.value = str.join('')
                    }
                }
                rowArr.push(rowDic)
            }
            sectionDic.data = rowArr;
            newData.push(sectionDic)
        }
        return newData
    }
    dealIsSaved(type,data,arr,callback){
        let paramStr = ''

        if(type == '02'){
            paramStr = data.CYRMC + ',' + data.SPFMC + ',' + data.SHRMC + ',' + data.FHRMC
        }else if (type == '03'){
            paramStr = data.GHDW + ',' + data.XHDWMC
        }else if (type == '01' || type == '04' || type == '10' || type == '11'){
            paramStr = data.GFMC + ',' + data.XFMC
        }
        UserInfoStore.getUserInfo().then(
            (user) => {
                if(user){
                    apis.verifyInvoiceIsSave(user.username,paramStr).then((res)=>{

                        if(res.code == 0 && res.status && res.status.length >0 && this.checkData(type,res.status) ){
                            for (let index = 0 ; index < res.status.length ; index++){
                                if(res.status[index]){
                                    arr[index+1].isSaved = true
                                }
                                if(!arr[index+1].data[1].value){
                                    arr[index+1].isShowSaveStatus = false
                                }

                            }
                            callback(arr)
                        }else{
                            for(let index = 0; index <arr.length ; index++){
                                arr[index].isShowSaveStatus = false
                                arr.isSaved = false
                            }
                            callback(arr)
                        }


                    },(e)=>{
                        for(let index = 0; index <arr.length ; index++){
                            arr[index].isShowSaveStatus = false
                            arr.isSaved = false
                        }
                        callback(arr)
                    })
                }else{
                    for(let index = 0; index <arr.length ; index++){
                        arr[index].isShowSaveStatus = false
                        arr.isSaved = false
                    }
                    callback(arr)

                }

            },
            (e) => {
                for(let index = 0; index <arr.length ; index++){
                    arr[index].isShowSaveStatus = false
                    arr.isSaved = false
                }
                callback(arr)
            },
        );

    }
    checkData(type,arr){
        if(type == '01' || type == '03' || type == '04' || type == '10' || type == '11'){
            if(arr.length == 2)return true
        }else{
            if(arr.length == 4)return true
        }
        return false
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <SectionList
                    sections={this.state.dataSource}
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                    stickySectionHeadersEnabled={false}

                />
            </View>
        )
    }
    _renderItem (info) {

        if(info.item.value){
            let text = info.item.key
            return(
                <CheckInfoItemTwo name={text} value={info.item.value}/>
            )
        }else{
            return null
        }
    };
    _renderSectionHeader (info) {
        if(info.section.isCoverGoods){
            return(
                <View>
                    <SectionHeader style={{backgroundColor:'#E8E2D6'}} text ={info.section.key} textStyle={{color:'#AE915A'}} />
                    {
                        this.state.goodsList.map((item,index)=>{
                            if(this.props.invoiceType == '01' || this.props.invoiceType == '04' || this.props.invoiceType == '10'){
                                return(
                                    <View key={index}>
                                        {item.HWMC?<CheckInfoItemTwo name={'货物或应税劳务、服务名称'} value={item.HWMC}/>:null}
                                        {item.GGXH?<CheckInfoItemTwo name={'规格型号'} value={item.GGXH}/>:null}
                                        <CheckInfoItemFour name1="单位" value1={item.DW} name2="数量" value2={item.SL} />
                                        <CheckInfoItemFour name1="单价" value1={item.DJ} name2="金额" value2={item.JE} />
                                        <CheckInfoItemFour name1="税率" value1={item.SLV+'%'} name2="税额" value2={item.SE} />
                                    </View>
                                )
                            }else if(this.props.invoiceType == '02'){
                                return(
                                    <View key={index}>
                                        {item.FYXM?<CheckInfoItemTwo name={'费用项目'} value={item.FYXM}/>:null}
                                        {item.JE?<CheckInfoItemTwo name={'金额'} value={item.JE}/>:null}
                                    </View>
                                )
                            }else if(this.props.invoiceType == '11'){
                                return(
                                    <View key={index}>
                                        {item.XM?<CheckInfoItemTwo name={'项目'} value={item.XM}/>:null}
                                        {item.SL?<CheckInfoItemTwo name={'数量'} value={item.SL}/>:null}
                                        {item.HSDJ?<CheckInfoItemTwo name={'含税单价'} value={item.HSDJ}/>:null}
                                        {item.HSJE?<CheckInfoItemTwo name={'含税金额'} value={item.HSJE}/>:null}
                                    </View>
                                )
                            }else{
                                return(
                                    <View key={index} />
                                )
                            }

                        })
                    }
                </View>
            )
        }else{
            return(
                <SectionHeader
                    style={{backgroundColor:'#E8E2D6'}}
                    text ={info.section.key}
                    textStyle={{color:'#AE915A'}}
                    rightView = {info.section.isShowSaveStatus?info.section.isSaved?<Text style={{fontSize:16,color:'#999999'}}>已保存</Text>:<TouchableOpacity onPress={()=>{this.saveClick(info.section)}}><View
                        style={{backgroundColor:'#ffffff',borderWidth:1,borderColor:'#C6A567',width:77,height:30,borderRadius:15,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:16,color:'#AE915A'}}>保存</Text></View></TouchableOpacity>:null}
                />
            )
        }
    };
    saveClick (item) {

        let company= ''//公司名称
        let taxID= ''//税号
        let address = ''//地址
        let mobile = ''//手机号
        let bank = ''//开户行
        let account = ''//银行账号
        company = item.data[0].value
        taxID = item.data[1].value

        if(this.props.invoiceType == '01' || this.props.invoiceType == '04' || this.props.invoiceType == '10'){
            address = util.addressAndPhone(item.data[2].value).address
            mobile = util.addressAndPhone(item.data[2].value).phone
            bank = util.bankAddressAndAccount(item.data[3].value).address
            account = util.bankAddressAndAccount(item.data[3].value).account
        }
        if(this.props.invoiceType == '03'){
            mobile = item.data[2].value
            address = item.data[3].value
            bank = item.data[4].value
            account = item.data[5].value

        }
        //AddInvoiceTitlePage
        this.push({
            screen:'AddInvoiceTitlePage',
            title:'编辑',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                company,
                taxID,
                address,
                mobile,
                bank,
                account,
                callback:this._callback
            }

        })
    }
}







